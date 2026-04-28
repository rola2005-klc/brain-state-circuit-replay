#!/usr/bin/env python3
"""Evaluate the synthetic state decoder and print a compact report."""

from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATOR_PATH = ROOT / "scripts" / "generate_synthetic_data.py"

spec = importlib.util.spec_from_file_location("generate_synthetic_data", GENERATOR_PATH)
generator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(generator)


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate nearest-centroid decoding on synthetic brain-state samples.")
    parser.add_argument("--samples-per-state", type=int, default=120)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    samples = generator.generate_samples(samples_per_state=args.samples_per_state, seed=args.seed)
    result = generator.evaluate_nearest_centroid(samples, test_fraction=0.25, seed=args.seed)
    print("Synthetic brain-state decoding report")
    print("====================================")
    print(f"rows: {len(samples)}")
    print(f"train/test: {result['n_train']}/{result['n_test']}")
    print(f"labels: {', '.join(result['labels'])}")
    print(f"nearest-centroid accuracy: {result['accuracy']:.2%}")
    print("confusion matrix:")
    for actual, preds in result["confusion"].items():
        cells = ", ".join(f"{predicted}={count}" for predicted, count in sorted(preds.items()))
        print(f"  {actual}: {cells}")


if __name__ == "__main__":
    main()
