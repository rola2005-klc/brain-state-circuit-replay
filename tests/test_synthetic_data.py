import csv
import importlib.util
import pathlib
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "generate_synthetic_data.py"


class SyntheticDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("generate_synthetic_data", SCRIPT)
        cls.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.module)

    def test_generate_samples_has_required_schema_and_size(self):
        samples = self.module.generate_samples(samples_per_state=12, seed=123)
        self.assertEqual(len(samples), 48)
        required = {
            "sample_id",
            "target_state",
            "protocol",
            "hippocampus",
            "amygdala",
            "pfc",
            "sensory",
            "insula",
            "motor",
            "cue_strength",
            "stimulation_strength",
            "feedback_strength",
            "similarity_to_target",
            "reconstruction_error",
            "safety_risk",
        }
        self.assertTrue(required.issubset(samples[0].keys()))

    def test_samples_are_normalized_and_protocols_are_diverse(self):
        samples = self.module.generate_samples(samples_per_state=20, seed=7)
        protocols = {row["protocol"] for row in samples}
        states = {row["target_state"] for row in samples}
        self.assertGreaterEqual(len(protocols), 4)
        self.assertEqual(states, {"calm", "childhood", "flow", "grief"})
        for row in samples:
            for key in ["hippocampus", "amygdala", "pfc", "sensory", "insula", "motor", "similarity_to_target", "safety_risk"]:
                self.assertGreaterEqual(float(row[key]), 0.0, key)
                self.assertLessEqual(float(row[key]), 1.0, key)

    def test_nearest_centroid_decoder_beats_chance_on_generated_data(self):
        samples = self.module.generate_samples(samples_per_state=40, seed=99)
        result = self.module.evaluate_nearest_centroid(samples, test_fraction=0.25, seed=99)
        self.assertGreaterEqual(result["accuracy"], 0.70)
        self.assertEqual(set(result["labels"]), {"calm", "childhood", "flow", "grief"})

    def test_write_csv_round_trip(self):
        samples = self.module.generate_samples(samples_per_state=3, seed=5)
        with tempfile.TemporaryDirectory() as tmp:
            out = pathlib.Path(tmp) / "samples.csv"
            self.module.write_csv(samples, out)
            with out.open(newline="") as f:
                rows = list(csv.DictReader(f))
        self.assertEqual(len(rows), 12)
        self.assertEqual(rows[0]["sample_id"], samples[0]["sample_id"])


if __name__ == "__main__":
    unittest.main()
