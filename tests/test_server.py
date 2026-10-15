import unittest
import json
from starlette.testclient import TestClient
from server import app

class TestServer(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        resp = self.client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("has_api_key", data)

    def test_explainer_endpoint(self):
        resp = self.client.get("/api/explainer")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("endpoints", data)
        self.assertEqual(len(data["endpoints"]), 3)

    def test_agent_analyze_requires_url(self):
        resp = self.client.post("/api/agent-analyze", json={})
        self.assertEqual(resp.status_code, 400)

    def test_static_index_served(self):
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("TinyFish", resp.text)
        self.assertIn("Career Scout", resp.text)
        self.assertIn("root", resp.text)

    def test_diagnostics_endpoint(self):
        resp = self.client.get("/api/diagnostics")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "online")
        self.assertEqual(data["tier"], "3+ Endpoints Chained")
        self.assertEqual(len(data["endpoints"]), 3)

if __name__ == "__main__":
    unittest.main()
