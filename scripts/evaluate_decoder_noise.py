#!/usr/bin/env python3
"""Sweep decoding accuracy across background-noise levels.

Addresses the professor-flagged limitation: can the decoder still tell apart a
target "happy memory" state from background noise, not just clean toy data?

The script reuses generate_synthetic_data.generate_samples() and adds Gaussian
noise of varying sigma to the 6-dim feature vector at evaluation time. It
compares two classifiers:

  * the existing nearest-centroid baseline (no extra deps)
  * scikit-learn LogisticRegression as a slightly stronger reference

Results are printed as a table and written to data/decoder_noise_sweep.csv.

This remains a synthetic-data pipeline demonstration. It does not validate
real-brain decoding.
"""

from __future__ import annotations

import argparse
import csv
import importlib.util
import random
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

ROOT = Path(__file__).resolve().parents[1]
GENERATOR_PATH = ROOT / "scripts" / "generate_synthetic_data.py"

_spec = importlib.util.spec_from_file_location("generate_synthetic_data", GENERATOR_PATH)
generator = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(generator)

SYSTEMS = generator.SYSTEMS
DEFAULT_SIGMAS = (0.0, 0.05, 0.1, 0.2, 0.4, 0.8, 1.5)


def add_gaussian_noise(rows: List[Dict[str, str]], sigma: float, seed: int) -> List[Dict[str, str]]:
    if sigma <= 0:
        return [dict(r) for r in rows]
    rng = random.Random(seed)
    noisy: List[Dict[str, str]] = []
    for row in rows:
        new = dict(row)
        for system in SYSTEMS:
            v = float(row[system]) + rng.gauss(0.0, sigma)
            new[system] = f"{generator.clamp(v):.6f}"
        noisy.append(new)
    return noisy


def split_train_test(samples: List[Dict[str, str]], test_fraction: float, seed: int) -> Tuple[List[Dict[str, str]], List[Dict[str, str]]]:
    rng = random.Random(seed)
    shuffled = samples[:]
    rng.shuffle(shuffled)
    split = max(1, int(len(shuffled) * (1 - test_fraction)))
    return shuffled[:split], shuffled[split:]


def nearest_centroid_accuracy(train: List[Dict[str, str]], test: List[Dict[str, str]]) -> float:
    grouped: Dict[str, List[List[float]]] = defaultdict(list)
    for row in train:
        grouped[row["target_state"]].append(generator.vector(row))
    centroids = {
        label: [sum(values[i] for values in vectors) / len(vectors) for i in range(len(SYSTEMS))]
        for label, vectors in grouped.items()
    }
    if not test:
        return 0.0
    correct = 0
    for row in test:
        v = generator.vector(row)
        predicted = min(centroids, key=lambda label: generator.squared_distance(v, centroids[label]))
        correct += int(predicted == row["target_state"])
    return correct / len(test)


def logistic_regression_accuracy(train: List[Dict[str, str]], test: List[Dict[str, str]], seed: int) -> float:
    try:
        from sklearn.linear_model import LogisticRegression
    except ImportError:
        return float("nan")
    if not test:
        return 0.0
    X_train = [generator.vector(r) for r in train]
    y_train = [r["target_state"] for r in train]
    X_test = [generator.vector(r) for r in test]
    y_test = [r["target_state"] for r in test]
    model = LogisticRegression(max_iter=1000, random_state=seed)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    return sum(int(p == y) for p, y in zip(preds, y_test)) / len(y_test)


def sweep(samples_per_state: int, sigmas: Sequence[float], seed: int) -> List[Dict[str, float]]:
    base = generator.generate_samples(samples_per_state=samples_per_state, seed=seed)
    train_clean, test_clean = split_train_test(base, test_fraction=0.25, seed=seed)
    rows: List[Dict[str, float]] = []
    for sigma in sigmas:
        noisy_test = add_gaussian_noise(test_clean, sigma=sigma, seed=seed + 1)
        nc_acc = nearest_centroid_accuracy(train_clean, noisy_test)
        lr_acc = logistic_regression_accuracy(train_clean, noisy_test, seed=seed)
        rows.append({
            "sigma": sigma,
            "nearest_centroid_accuracy": nc_acc,
            "logistic_regression_accuracy": lr_acc,
            "n_test": len(noisy_test),
        })
    return rows


def write_csv(rows: List[Dict[str, float]], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["sigma", "nearest_centroid_accuracy", "logistic_regression_accuracy", "n_test"])
        writer.writeheader()
        for r in rows:
            writer.writerow({
                "sigma": f"{r['sigma']:.4f}",
                "nearest_centroid_accuracy": f"{r['nearest_centroid_accuracy']:.4f}",
                "logistic_regression_accuracy": f"{r['logistic_regression_accuracy']:.4f}",
                "n_test": r["n_test"],
            })


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--samples-per-state", type=int, default=120)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--sigmas", type=float, nargs="+", default=list(DEFAULT_SIGMAS))
    parser.add_argument("--out", type=Path, default=ROOT / "data" / "decoder_noise_sweep.csv")
    args = parser.parse_args()

    rows = sweep(args.samples_per_state, args.sigmas, args.seed)
    write_csv(rows, args.out)

    print("Decoder noise-robustness sweep")
    print("==============================")
    print(f"samples per state: {args.samples_per_state}, seed: {args.seed}")
    print(f"chance accuracy (4 classes): 25.00%")
    print()
    print(f"{'sigma':>8} | {'nearest-centroid':>18} | {'logistic-reg':>14} | {'n_test':>6}")
    print("-" * 60)
    for r in rows:
        lr = "n/a" if r["logistic_regression_accuracy"] != r["logistic_regression_accuracy"] else f"{r['logistic_regression_accuracy']:.2%}"
        print(f"{r['sigma']:>8.3f} | {r['nearest_centroid_accuracy']:>17.2%} | {lr:>14} | {r['n_test']:>6}")
    print()
    print(f"wrote {args.out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
