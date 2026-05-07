import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "simulate_stimulation_coverage.py"


class StimulationCoverageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("simulate_stimulation_coverage", SCRIPT)
        cls.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.module)

    def test_recall_increases_with_radius_at_fixed_k(self):
        m = self.module
        ensemble = m.sample_ensemble(150, seed=1)
        background = m.sample_background(1500, seed=2)
        electrodes = m.grid_electrodes(36)
        radii = [0.02, 0.06, 0.15, 0.30]
        recalls = []
        for r in radii:
            _, recall, _, _ = m.evaluate(ensemble, background, electrodes, r)
            recalls.append(recall)
        for prev, nxt in zip(recalls, recalls[1:]):
            self.assertGreaterEqual(nxt, prev - 1e-9)
        self.assertGreater(recalls[-1], 0.95)
        self.assertLess(recalls[0], 0.5)

    def test_precision_collapses_when_radius_far_exceeds_ensemble_extent(self):
        m = self.module
        ensemble = m.sample_ensemble(150, seed=3)
        background = m.sample_background(1500, seed=4)
        electrodes = m.grid_electrodes(9)
        precision_small, _, _, _ = m.evaluate(ensemble, background, electrodes, 0.06)
        precision_huge, _, _, _ = m.evaluate(ensemble, background, electrodes, 0.30)
        self.assertGreater(precision_small, precision_huge)

    def test_sweep_returns_one_row_per_combo(self):
        m = self.module
        rows = m.sweep(
            k_values=[4, 16],
            r_values=[0.05, 0.15, 0.30],
            ensemble_size=80,
            background_size=400,
            seed=11,
            distributed=False,
        )
        self.assertEqual(len(rows), 6)
        for row in rows:
            self.assertIn("precision", row)
            self.assertIn("recall", row)
            self.assertGreaterEqual(row["precision"], 0.0)
            self.assertLessEqual(row["recall"], 1.0)


if __name__ == "__main__":
    unittest.main()
