#!/usr/bin/env python3
"""Generate accessible visualizations for the two flagged limitations.

Produces three PNGs in docs/figures/:

  1. decoder-noise-curve.png      — accuracy vs noise sigma, with chance line
  2. stim-coverage-spatial.png    — 4 panels showing what coverage *looks like*
                                     in the unit square (focal vs distributed
                                     engram, few-big vs many-small electrodes)
  3. limitations-summary.png      — a single one-page figure combining both,
                                     suitable for handing to an advisor

These complement (do not replace) the existing precision-recall scatter at
docs/figures/stim-coverage.png.
"""

from __future__ import annotations

import importlib.util
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
FIG_DIR = ROOT / "docs" / "figures"


def _load(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


noise_mod = _load("evaluate_decoder_noise", ROOT / "scripts" / "evaluate_decoder_noise.py")
stim_mod = _load("simulate_stimulation_coverage", ROOT / "scripts" / "simulate_stimulation_coverage.py")


# ---------------------------------------------------------------------------
# Figure 1: decoder noise curve
# ---------------------------------------------------------------------------

def plot_decoder_noise_curve(out_path: Path, ax=None) -> None:
    sigmas = [0.0, 0.05, 0.1, 0.2, 0.4, 0.8, 1.5]
    rows = noise_mod.sweep(samples_per_state=120, sigmas=sigmas, seed=42)
    nc = [r["nearest_centroid_accuracy"] for r in rows]
    lr = [r["logistic_regression_accuracy"] for r in rows]

    standalone = ax is None
    if standalone:
        fig, ax = plt.subplots(figsize=(8, 5))

    ax.plot(sigmas, nc, marker="o", linewidth=2, label="Nearest-centroid", color="#1f77b4")
    ax.plot(sigmas, lr, marker="s", linewidth=2, label="Logistic regression", color="#ff7f0e")
    ax.axhline(0.25, linestyle="--", color="gray", alpha=0.7, label="Chance (25%)")

    # Shade "realistic noise" region — illustrative, not measured.
    ax.axvspan(0.3, 1.5, alpha=0.12, color="red", label="Realistic EEG noise (illustrative)")

    ax.set_xlabel("Background noise σ added to feature vector", fontsize=11)
    ax.set_ylabel("Decoder accuracy", fontsize=11)
    ax.set_title("Limitation 1: Decoding power — accuracy collapses under noise",
                 fontsize=12, fontweight="bold")
    ax.set_ylim(0, 1.0)
    ax.set_xlim(-0.05, 1.55)
    ax.grid(True, alpha=0.3)
    ax.legend(loc="upper right", fontsize=9)

    # Annotate the cliff
    ax.annotate(
        "91% on clean toy data",
        xy=(0.0, 0.91),
        xytext=(0.15, 0.95),
        fontsize=9,
        arrowprops=dict(arrowstyle="->", color="#1f77b4", alpha=0.6),
    )
    ax.annotate(
        "Falls to chance\nbefore realistic noise",
        xy=(0.8, 0.30),
        xytext=(0.9, 0.55),
        fontsize=9,
        arrowprops=dict(arrowstyle="->", color="red", alpha=0.6),
    )

    if standalone:
        fig.tight_layout()
        fig.savefig(out_path, dpi=150)
        plt.close(fig)


# ---------------------------------------------------------------------------
# Figure 2: spatial 4-panel coverage
# ---------------------------------------------------------------------------

PANEL_SCENARIOS = [
    {
        "title": "Few big electrodes — focal engram",
        "k": 4, "r": 0.22,
        "distributed": False,
        "subtitle": "wide nets cover the cluster\nbut also stimulate everything else",
    },
    {
        "title": "Few big electrodes — distributed engram",
        "k": 4, "r": 0.22,
        "distributed": True,
        "subtitle": "still imprecise, and may miss\nsome of the engram clusters",
    },
    {
        "title": "Many small electrodes — focal engram",
        "k": 64, "r": 0.04,
        "distributed": False,
        "subtitle": "tighter — but only effective if\nthe grid aligns with the cluster",
    },
    {
        "title": "Many small electrodes — distributed engram",
        "k": 64, "r": 0.04,
        "distributed": True,
        "subtitle": "the harder case — distributed engrams\nneed per-subject targeting, not a fixed grid",
    },
]


def _draw_panel(ax, scenario: dict, ensemble_size: int = 200, background_size: int = 1500, seed: int = 42):
    clusters = ((0.3, 0.7), (0.7, 0.3), (0.5, 0.5)) if scenario["distributed"] else ((0.5, 0.5),)
    spread = 0.05 if scenario["distributed"] else 0.07
    ensemble = stim_mod.sample_ensemble(ensemble_size, seed=seed, clusters=clusters, spread=spread)
    background = stim_mod.sample_background(background_size, seed=seed + 1)
    electrodes = stim_mod.grid_electrodes(scenario["k"])
    r = scenario["r"]
    precision, recall, hits, off = stim_mod.evaluate(ensemble, background, electrodes, r)

    # Draw stimulation circles first (so they sit behind points)
    for ex, ey in electrodes:
        circle = mpatches.Circle((ex, ey), r, alpha=0.18, color="#1f77b4", linewidth=0)
        ax.add_patch(circle)

    # Background non-target points (faint)
    bx = [p[0] for p in background]
    by = [p[1] for p in background]
    ax.scatter(bx, by, s=2, color="lightgray", alpha=0.5, label="non-target tissue")

    # Memory ensemble (red)
    ex_pts = [p[0] for p in ensemble]
    ey_pts = [p[1] for p in ensemble]
    ax.scatter(ex_pts, ey_pts, s=18, color="#d62728", edgecolors="darkred", linewidths=0.3, label="memory ensemble")

    # Electrodes (blue X)
    elx = [e[0] for e in electrodes]
    ely = [e[1] for e in electrodes]
    ax.scatter(elx, ely, marker="x", s=60, color="#1f77b4", linewidths=2, label="electrodes")

    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(-0.02, 1.02)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])

    ax.set_title(scenario["title"], fontsize=11, fontweight="bold")
    metrics_text = f"Recall: {recall:.0%}   Precision: {precision:.0%}\n{hits}/{len(ensemble)} engram hit, {off} off-target"
    ax.text(0.5, -0.08, metrics_text, transform=ax.transAxes,
            ha="center", va="top", fontsize=9,
            bbox=dict(boxstyle="round,pad=0.3", facecolor="white", edgecolor="gray", alpha=0.9))
    ax.text(0.5, -0.28, scenario["subtitle"], transform=ax.transAxes,
            ha="center", va="top", fontsize=8, style="italic", color="#444")


def plot_spatial_coverage(out_path: Path, fig=None, axes=None) -> None:
    standalone = fig is None
    if standalone:
        fig, axes = plt.subplots(2, 2, figsize=(11, 11.5))

    for ax, scenario in zip(axes.flat, PANEL_SCENARIOS):
        _draw_panel(ax, scenario)

    legend_handles = [
        mpatches.Patch(color="#d62728", label="memory ensemble (target)"),
        mpatches.Patch(color="lightgray", label="non-target tissue"),
        mpatches.Patch(color="#1f77b4", alpha=0.4, label="electrode stimulation field"),
        plt.Line2D([0], [0], marker="x", color="#1f77b4", linestyle="None",
                   markersize=8, markeredgewidth=2, label="electrode position"),
    ]
    fig.legend(handles=legend_handles, loc="lower center", ncol=4, fontsize=9, frameon=True,
               bbox_to_anchor=(0.5, -0.01))

    fig.suptitle(
        "Limitation 2: Stimulation coverage vs precision\n"
        "(toy 2-D abstraction — real anatomy is 3-D, sparser, and individual)",
        fontsize=12, fontweight="bold",
    )

    if standalone:
        fig.tight_layout(rect=(0, 0.04, 1, 0.96))
        fig.savefig(out_path, dpi=150, bbox_inches="tight")
        plt.close(fig)


# ---------------------------------------------------------------------------
# Figure 3: combined one-page summary
# ---------------------------------------------------------------------------

def plot_summary(out_path: Path) -> None:
    fig = plt.figure(figsize=(12, 14))
    gs = fig.add_gridspec(3, 2, height_ratios=[1.0, 1.4, 0.25], hspace=0.45, wspace=0.15)

    # Top: decoder curve spans both columns
    ax_top = fig.add_subplot(gs[0, :])
    plot_decoder_noise_curve(out_path=None, ax=ax_top)

    # Middle: 2x2 spatial panels
    ax_panels = [
        fig.add_subplot(gs[1, 0]),
        fig.add_subplot(gs[1, 1]),
    ]
    # Use just 2 panels in summary (one focal, one distributed) at K=64
    summary_scenarios = [
        {
            "title": "Many electrodes, focal engram",
            "k": 64, "r": 0.04,
            "distributed": False,
            "subtitle": "tight precision possible — if the grid aligns with the cluster",
        },
        {
            "title": "Many electrodes, distributed engram",
            "k": 64, "r": 0.04,
            "distributed": True,
            "subtitle": "the realistic case — needs per-subject targeting",
        },
    ]
    for ax, scenario in zip(ax_panels, summary_scenarios):
        _draw_panel(ax, scenario)

    # Bottom: caption / takeaway
    ax_caption = fig.add_subplot(gs[2, :])
    ax_caption.axis("off")
    ax_caption.text(
        0.5, 0.6,
        "Both limitations are made visible — not solved.",
        ha="center", fontsize=13, fontweight="bold",
    )
    ax_caption.text(
        0.5, 0.15,
        "Honest near-term path: cue-driven reactivation (use the brain's own retrieval) +\n"
        "state-level neuromodulation (bias arousal/valence, don't try to write content).",
        ha="center", fontsize=10, style="italic", color="#444",
    )

    fig.suptitle("Brain-State Circuit Resonance — two structural limitations",
                 fontsize=14, fontweight="bold", y=0.995)

    fig.savefig(out_path, dpi=150, bbox_inches="tight")
    plt.close(fig)


def main() -> None:
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    plot_decoder_noise_curve(FIG_DIR / "decoder-noise-curve.png")
    print(f"wrote {FIG_DIR / 'decoder-noise-curve.png'}")
    plot_spatial_coverage(FIG_DIR / "stim-coverage-spatial.png")
    print(f"wrote {FIG_DIR / 'stim-coverage-spatial.png'}")
    plot_summary(FIG_DIR / "limitations-summary.png")
    print(f"wrote {FIG_DIR / 'limitations-summary.png'}")


if __name__ == "__main__":
    main()
