import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "evaluate_decoder_noise.py"


class DecoderNoiseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("evaluate_decoder_noise", SCRIPT)
        cls.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.module)

    def test_sweep_accuracy_decreases_with_noise(self):
        sigmas = [0.0, 0.1, 0.4, 1.5]
        rows = self.module.sweep(samples_per_state=40, sigmas=sigmas, seed=7)
        self.assertEqual(len(rows), len(sigmas))
        clean_acc = rows[0]["nearest_centroid_accuracy"]
        noisy_acc = rows[-1]["nearest_centroid_accuracy"]
        self.assertGreater(clean_acc, 0.7, "clean synthetic data should decode well")
        self.assertLess(noisy_acc, clean_acc - 0.3, "heavy noise should collapse decoding")
        # Allow small jitter, but trend should be monotonically non-increasing
        # at the coarse sigma steps used here.
        accs = [r["nearest_centroid_accuracy"] for r in rows]
        for prev, nxt in zip(accs, accs[1:]):
            self.assertLessEqual(nxt, prev + 0.05)


if __name__ == "__main__":
    unittest.main()
