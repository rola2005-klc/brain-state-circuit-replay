#!/usr/bin/env python3
"""Generate a synthetic brain-state dataset for Brain-State Circuit Replay.

This is an educational toy dataset. It does not represent real neural recordings.
It exists to make the project data-backed: each row is a simulated distributed
state vector after a protocol-specific intervention.
"""

from __future__ import annotations

import argparse
import csv
import math
import random
from collections import defaultdict
from pathlib import Path
from typing import Dict, Iterable, List, Sequence

SYSTEMS = ["hippocampus", "amygdala", "pfc", "sensory", "insula", "motor"]

TARGET_STATES: Dict[str, Dict[str, float]] = {
    "calm": {"hippocampus": 0.45, "amygdala": 0.22, "pfc": 0.86, "sensory": 0.55, "insula": 0.42, "motor": 0.36},
    "childhood": {"hippocampus": 0.92, "amygdala": 0.58, "pfc": 0.52, "sensory": 0.83, "insula": 0.68, "motor": 0.30},
    "flow": {"hippocampus": 0.38, "amygdala": 0.30, "pfc": 0.74, "sensory": 0.67, "insula": 0.52, "motor": 0.88},
    "grief": {"hippocampus": 0.76, "amygdala": 0.90, "pfc": 0.36, "sensory": 0.62, "insula": 0.82, "motor": 0.25},
}

PROTOCOLS = {
    "cue": {
        "weights": {"hippocampus": 1.15, "sensory": 1.05, "amygdala": 0.35, "insula": 0.45, "pfc": 0.25, "motor": 0.15},
        "risk_multiplier": 0.80,
        "precision": 0.72,
    },
    "neurofeedback": {
        "weights": {"hippocampus": 0.45, "sensory": 0.35, "amygdala": 0.75, "insula": 0.70, "pfc": 1.20, "motor": 0.35},
        "risk_multiplier": 0.65,
        "precision": 0.82,
    },
    "dbs": {
        "weights": {"hippocampus": 0.80, "sensory": 0.35, "amygdala": 1.10, "insula": 1.00, "pfc": 0.95, "motor": 0.40},
        "risk_multiplier": 1.28,
        "precision": 0.88,
    },
    "mimo": {
        "weights": {"hippocampus": 1.25, "sensory": 0.80, "amygdala": 0.40, "insula": 0.45, "pfc": 0.95, "motor": 0.55},
        "risk_multiplier": 0.92,
        "precision": 0.94,
    },
}

FIELDNAMES = [
    "sample_id",
    "target_state",
    "protocol",
    *SYSTEMS,
    "cue_strength",
    "stimulation_strength",
    "feedback_strength",
    "similarity_to_target",
    "reconstruction_error",
    "safety_risk",
]


def clamp(value: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, value))


def cosine_similarity(a: Dict[str, float], b: Dict[str, float]) -> float:
    dot = sum(a[k] * b[k] for k in SYSTEMS)
    mag_a = math.sqrt(sum(a[k] ** 2 for k in SYSTEMS))
    mag_b = math.sqrt(sum(b[k] ** 2 for k in SYSTEMS))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return clamp(dot / (mag_a * mag_b))


def reconstruction_error(a: Dict[str, float], b: Dict[str, float]) -> float:
    return math.sqrt(sum((a[k] - b[k]) ** 2 for k in SYSTEMS) / len(SYSTEMS))


def safety_risk(pattern: Dict[str, float], protocol: str) -> float:
    base = 0.55 * pattern["amygdala"] + 0.30 * pattern["insula"] - 0.25 * pattern["pfc"] + 0.15
    return clamp(base * PROTOCOLS[protocol]["risk_multiplier"])


def baseline_state(rng: random.Random) -> Dict[str, float]:
    return {system: clamp(0.35 + rng.uniform(-0.24, 0.24)) for system in SYSTEMS}


def apply_protocol(
    current: Dict[str, float],
    target: Dict[str, float],
    protocol: str,
    cue_strength: float,
    stimulation_strength: float,
    feedback_strength: float,
    rng: random.Random,
) -> Dict[str, float]:
    spec = PROTOCOLS[protocol]
    # Cue phase: memory/context cue gives a first weak nudge, mostly hippocampal/sensory.
    cue_weights = PROTOCOLS["cue"]["weights"]
    state = {}
    for system in SYSTEMS:
        cue_gain = cue_strength * 0.58 * cue_weights[system]
        state[system] = clamp(current[system] + (target[system] - current[system]) * clamp(cue_gain, 0, 0.86))

    similarity = cosine_similarity(state, target)
    adaptive_gain = stimulation_strength * spec["precision"] * (0.55 + feedback_strength * (1 - similarity))
    next_state = {}
    for system in SYSTEMS:
        gain = clamp(adaptive_gain * spec["weights"][system], 0, 0.88)
        noise = rng.gauss(0, 0.022 * (1.10 - spec["precision"] * 0.35))
        next_state[system] = clamp(state[system] + (target[system] - state[system]) * gain + noise)

    if protocol == "neurofeedback":
        next_state["pfc"] = clamp(next_state["pfc"] + 0.05 * feedback_strength)
        next_state["amygdala"] = clamp(next_state["amygdala"] - 0.04 * feedback_strength)
    elif protocol == "mimo":
        next_state["hippocampus"] = clamp(next_state["hippocampus"] + (target["hippocampus"] - next_state["hippocampus"]) * 0.18)
        next_state["sensory"] = clamp(next_state["sensory"] + (target["sensory"] - next_state["sensory"]) * 0.10)
    elif protocol == "dbs" and safety_risk(next_state, protocol) > 0.58:
        next_state["amygdala"] = clamp(next_state["amygdala"] + 0.02 * stimulation_strength)
        next_state["insula"] = clamp(next_state["insula"] + 0.02 * stimulation_strength)

    # Synthetic dataset samples represent a post-intervention window, so each row
    # keeps a recognizable target-state signature while still retaining protocol
    # noise and safety differences.
    signature_gain = 0.22 + 0.18 * feedback_strength
    for system in SYSTEMS:
        next_state[system] = clamp(next_state[system] + (target[system] - next_state[system]) * signature_gain)

    return next_state


def generate_samples(samples_per_state: int = 80, seed: int = 42) -> List[Dict[str, str]]:
    rng = random.Random(seed)
    rows: List[Dict[str, str]] = []
    sample_index = 0
    protocols = list(PROTOCOLS)
    for state_name, target in TARGET_STATES.items():
        for i in range(samples_per_state):
            protocol = protocols[i % len(protocols)]
            cue_strength = rng.uniform(0.10, 0.90)
            stimulation_strength = rng.uniform(0.12, 0.72)
            feedback_strength = rng.uniform(0.15, 0.95)
            current = baseline_state(rng)
            pattern = apply_protocol(current, target, protocol, cue_strength, stimulation_strength, feedback_strength, rng)
            row = {
                "sample_id": f"S{sample_index:05d}",
                "target_state": state_name,
                "protocol": protocol,
                "cue_strength": f"{cue_strength:.4f}",
                "stimulation_strength": f"{stimulation_strength:.4f}",
                "feedback_strength": f"{feedback_strength:.4f}",
                "similarity_to_target": f"{cosine_similarity(pattern, target):.4f}",
                "reconstruction_error": f"{reconstruction_error(pattern, target):.4f}",
                "safety_risk": f"{safety_risk(pattern, protocol):.4f}",
            }
            for system in SYSTEMS:
                row[system] = f"{pattern[system]:.4f}"
            rows.append(row)
            sample_index += 1
    return rows


def vector(row: Dict[str, str]) -> List[float]:
    return [float(row[system]) for system in SYSTEMS]


def squared_distance(a: Sequence[float], b: Sequence[float]) -> float:
    return sum((x - y) ** 2 for x, y in zip(a, b))


def evaluate_nearest_centroid(samples: List[Dict[str, str]], test_fraction: float = 0.25, seed: int = 42) -> Dict[str, object]:
    rng = random.Random(seed)
    shuffled = samples[:]
    rng.shuffle(shuffled)
    split = max(1, int(len(shuffled) * (1 - test_fraction)))
    train, test = shuffled[:split], shuffled[split:]
    grouped: Dict[str, List[List[float]]] = defaultdict(list)
    for row in train:
        grouped[row["target_state"]].append(vector(row))
    centroids = {
        label: [sum(values[i] for values in vectors) / len(vectors) for i in range(len(SYSTEMS))]
        for label, vectors in grouped.items()
    }
    correct = 0
    confusion: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for row in test:
        actual = row["target_state"]
        v = vector(row)
        predicted = min(centroids, key=lambda label: squared_distance(v, centroids[label]))
        confusion[actual][predicted] += 1
        correct += int(predicted == actual)
    accuracy = correct / len(test) if test else 0.0
    return {
        "accuracy": round(accuracy, 4),
        "labels": sorted(centroids),
        "confusion": {actual: dict(preds) for actual, preds in sorted(confusion.items())},
        "n_train": len(train),
        "n_test": len(test),
    }


def write_csv(samples: Iterable[Dict[str, str]], path: Path) -> None:
    rows = list(samples)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate synthetic brain-state samples.")
    parser.add_argument("--samples-per-state", type=int, default=80)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--out", type=Path, default=Path("data/synthetic_state_samples.csv"))
    args = parser.parse_args()
    samples = generate_samples(args.samples_per_state, args.seed)
    write_csv(samples, args.out)
    metrics = evaluate_nearest_centroid(samples, seed=args.seed)
    print(f"wrote {len(samples)} rows to {args.out}")
    print(f"nearest-centroid decoding accuracy: {metrics['accuracy']:.2%} ({metrics['n_test']} test rows)")


if __name__ == "__main__":
    main()
