#!/usr/bin/env python3
"""Toy 2-D simulation of stimulation coverage vs precision.

Addresses the professor-flagged limitation: even if we knew where a memory
"lives", can a finite array of electrodes cover that ensemble densely enough
to evoke the memory without recruiting unrelated neurons?

The 2-D unit square is a deliberate abstraction. It is NOT anatomy. It exists
only to visualize the well-known precision/coverage tradeoff for any focal
stimulation modality.

  * memory ensemble = N points drawn from one or more 2-D Gaussian clusters
  * electrodes      = K points placed on a regular sqrt(K)xsqrt(K) grid OR
                      randomly inside the unit square, each with stim radius r
  * stimulated set  = points within distance r of any electrode
  * recall          = ensemble points hit / total ensemble points
  * precision       = ensemble points hit / total points stimulated
                      (computed against a uniform background of "non-target"
                      points to give "off-target" a denominator)

Sweeps K and r, writes data/stimulation_coverage_sweep.csv, and emits a
matplotlib PNG to docs/figures/stim-coverage.png.
"""

from __future__ import annotations

import argparse
import csv
import math
import random
from pathlib import Path
from typing import List, Sequence, Tuple

ROOT = Path(__file__).resolve().parents[1]


def sample_ensemble(n: int, seed: int, clusters: Sequence[Tuple[float, float]] = ((0.5, 0.5),), spread: float = 0.06) -> List[Tuple[float, float]]:
    rng = random.Random(seed)
    points: List[Tuple[float, float]] = []
    for i in range(n):
        cx, cy = clusters[i % len(clusters)]
        x = max(0.0, min(1.0, rng.gauss(cx, spread)))
        y = max(0.0, min(1.0, rng.gauss(cy, spread)))
        points.append((x, y))
    return points


def sample_background(n: int, seed: int) -> List[Tuple[float, float]]:
    rng = random.Random(seed)
    return [(rng.random(), rng.random()) for _ in range(n)]


def grid_electrodes(k: int) -> List[Tuple[float, float]]:
    side = max(1, int(round(math.sqrt(k))))
    step = 1.0 / (side + 1)
    return [((i + 1) * step, (j + 1) * step) for i in range(side) for j in range(side)]


def is_stimulated(point: Tuple[float, float], electrodes: Sequence[Tuple[float, float]], r: float) -> bool:
    r2 = r * r
    px, py = point
    for ex, ey in electrodes:
        if (ex - px) ** 2 + (ey - py) ** 2 <= r2:
            return True
    return False


def evaluate(ensemble: Sequence[Tuple[float, float]], background: Sequence[Tuple[float, float]], electrodes: Sequence[Tuple[float, float]], r: float) -> Tuple[float, float, int, int]:
    hits = sum(1 for p in ensemble if is_stimulated(p, electrodes, r))
    off_target = sum(1 for p in background if is_stimulated(p, electrodes, r))
    stimulated_total = hits + off_target
    recall = hits / len(ensemble) if ensemble else 0.0
    precision = hits / stimulated_total if stimulated_total else 0.0
    return precision, recall, hits, off_target


def sweep(
    k_values: Sequence[int],
    r_values: Sequence[float],
    ensemble_size: int,
    background_size: int,
    seed: int,
    distributed: bool,
) -> List[dict]:
    clusters = ((0.3, 0.7), (0.7, 0.3), (0.5, 0.5)) if distributed else ((0.5, 0.5),)
    ensemble = sample_ensemble(ensemble_size, seed=seed, clusters=clusters, spread=0.05 if distributed else 0.07)
    background = sample_background(background_size, seed=seed + 1)
    rows: List[dict] = []
    for k in k_values:
        electrodes = grid_electrodes(k)
        for r in r_values:
            precision, recall, hits, off = evaluate(ensemble, background, electrodes, r)
            rows.append({
                "k_electrodes": len(electrodes),
                "stim_radius": r,
                "precision": precision,
                "recall": recall,
                "hits": hits,
                "off_target": off,
                "distributed_ensemble": int(distributed),
            })
    return rows


def write_csv(rows: Sequence[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["k_electrodes", "stim_radius", "precision", "recall", "hits", "off_target", "distributed_ensemble"])
        writer.writeheader()
        for r in rows:
            writer.writerow({
                "k_electrodes": r["k_electrodes"],
                "stim_radius": f"{r['stim_radius']:.4f}",
                "precision": f"{r['precision']:.4f}",
                "recall": f"{r['recall']:.4f}",
                "hits": r["hits"],
                "off_target": r["off_target"],
                "distributed_ensemble": r["distributed_ensemble"],
            })


def plot(rows: Sequence[dict], path: Path) -> None:
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError:
        return
    by_k: dict = {}
    for r in rows:
        by_k.setdefault(r["k_electrodes"], []).append(r)
    fig, ax = plt.subplots(figsize=(7, 5))
    for k in sorted(by_k):
        series = sorted(by_k[k], key=lambda x: x["stim_radius"])
        recalls = [s["recall"] for s in series]
        precisions = [s["precision"] for s in series]
        ax.plot(recalls, precisions, marker="o", label=f"K={k} electrodes")
    ax.set_xlabel("Recall (ensemble coverage)")
    ax.set_ylabel("Precision (on-target / stimulated)")
    ax.set_title("Toy stimulation coverage vs precision\n(2-D abstraction, not anatomy)")
    ax.set_xlim(0, 1.05)
    ax.set_ylim(0, 1.05)
    ax.grid(True, alpha=0.3)
    ax.legend(loc="lower left", fontsize=8)
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(path, dpi=150)
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--k-values", type=int, nargs="+", default=[4, 9, 16, 36, 64, 144])
    parser.add_argument("--r-values", type=float, nargs="+", default=[0.02, 0.04, 0.06, 0.10, 0.15, 0.22, 0.30])
    parser.add_argument("--ensemble-size", type=int, default=200)
    parser.add_argument("--background-size", type=int, default=2000)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--distributed", action="store_true", help="model a distributed multi-cluster engram")
    parser.add_argument("--out-csv", type=Path, default=ROOT / "data" / "stimulation_coverage_sweep.csv")
    parser.add_argument("--out-png", type=Path, default=ROOT / "docs" / "figures" / "stim-coverage.png")
    args = parser.parse_args()

    rows = sweep(args.k_values, args.r_values, args.ensemble_size, args.background_size, args.seed, args.distributed)
    write_csv(rows, args.out_csv)
    plot(rows, args.out_png)

    print("Stimulation coverage/precision sweep (toy 2-D)")
    print("==============================================")
    print(f"ensemble: {args.ensemble_size} pts ({'distributed' if args.distributed else 'single cluster'})")
    print(f"background: {args.background_size} non-target pts")
    print(f"K values: {args.k_values}")
    print(f"r values: {args.r_values}")
    print()
    print(f"{'K':>4} | {'r':>6} | {'precision':>9} | {'recall':>7} | hits/off")
    print("-" * 56)
    for r in rows:
        print(f"{r['k_electrodes']:>4} | {r['stim_radius']:>6.3f} | {r['precision']:>9.2%} | {r['recall']:>7.2%} | {r['hits']}/{r['off_target']}")
    print()
    print(f"wrote {args.out_csv.relative_to(ROOT)}")
    print(f"wrote {args.out_png.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
