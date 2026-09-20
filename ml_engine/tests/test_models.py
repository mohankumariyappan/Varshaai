"""
Unit Tests for VARSHAAI ML Engine
"""

import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from pipeline import pipeline_instance

class TestVarshaaiMLEngine(unittest.TestCase):
    def setUp(self):
        self.pipeline = pipeline_instance

    def test_pipeline_initialized(self):
        self.assertTrue(self.pipeline.is_ready(), "Pipeline models should be loaded")

    def test_single_prediction_structure(self):
        pred = self.pipeline.predict_single("thiruvallur", lead_time=24)
        self.assertEqual(pred["district_id"], "thiruvallur")
        self.assertIn(pred["detected_regime"], self.pipeline.bundle["regimes"])
        self.assertGreaterEqual(pred["corrected_rainfall"], 0.0)
        self.assertGreaterEqual(pred["heavy_rain_probability"], 0.0)
        self.assertLessEqual(pred["heavy_rain_probability"], 1.0)
        self.assertLessEqual(pred["uncertainty_interval"]["lower_bound"], pred["uncertainty_interval"]["upper_bound"])
        self.assertIn(pred["risk_assessment"]["alert_level"], ["GREEN", "YELLOW", "ORANGE", "RED"])

    def test_regime_classification_behavior(self):
        # Severe cyclonic low pressure should classify as Monsoon Depression
        cyclonic_weather = {
            "pressure_anomaly": -11.0,
            "humidity_850": 98.0,
            "wind_convergence": 15.0,
            "moisture_flux": 58.0,
            "cape": 2500.0,
            "nwp_rainfall": 90.0
        }
        pred = self.pipeline.predict_single("thiruvallur", lead_time=24, custom_weather=cyclonic_weather)
        self.assertEqual(pred["detected_regime"], "Monsoon Depression")
        self.assertGreaterEqual(pred["regime_confidence"], 0.70)

    def test_verification_metrics(self):
        res = self.pipeline.verification_results
        self.assertIsNotNone(res)
        # RMSE reduction
        nwp_rmse = res["continuous"]["rmse"]["nwp"]
        var_rmse = res["continuous"]["rmse"]["varshaai"]
        self.assertLess(var_rmse, nwp_rmse, "VARSHAAI RMSE must be lower than Raw NWP")

if __name__ == "__main__":
    unittest.main()
