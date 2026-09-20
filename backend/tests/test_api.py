"""
Backend API Route Tests for VARSHAAI
"""

import unittest
import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(BASE_DIR, ".."))
sys.path.append(os.path.join(BASE_DIR, "..", "..", "ml_engine"))

from main import app
from fastapi.testclient import TestClient

class TestVarshaaiAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["platform"], "VARSHAAI")

    def test_districts_endpoint(self):
        response = self.client.get("/api/districts")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 10)

    def test_district_forecast_endpoint(self):
        response = self.client.get("/api/district/thiruvallur?lead_time=24")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["district_id"], "thiruvallur")
        self.assertIn("corrected_rainfall", data)
        self.assertIn("atmospheric_profile", data)
        self.assertIn("timeline", data)

    def test_map_layers_endpoint(self):
        response = self.client.get("/api/map/layers?lead_time=24")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["type"], "FeatureCollection")
        self.assertGreaterEqual(len(data["features"]), 10)

    def test_risk_radar_endpoint(self):
        response = self.client.get("/api/risk/radar?lead_time=24")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("radar_components", data)
        self.assertIn("district_alerts", data)

    def test_explain_endpoint(self):
        response = self.client.get("/api/explain/thiruvallur")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("explanation_factors", data)
        self.assertIn("meteorological_rationale", data)

    def test_verification_endpoint(self):
        response = self.client.get("/api/verification/skills")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "verified")
        self.assertIn("metrics", data)

    def test_historical_events_endpoint(self):
        response = self.client.get("/api/historical/events")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 3)

    def test_historical_replay_endpoint(self):
        response = self.client.get("/api/historical/replay/michaung-2023")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["stages"]), 7)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "HEALTHY")
        self.assertGreaterEqual(len(data["models"]), 4)

if __name__ == "__main__":
    unittest.main()
