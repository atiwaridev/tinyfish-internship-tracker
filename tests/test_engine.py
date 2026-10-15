import unittest
import os
from tinyfish_engine import TinyFishEngine

class TestTinyFishEngine(unittest.TestCase):
    def setUp(self):
        self.engine = TinyFishEngine()

    def test_default_env_api_key_loaded(self):
        """Verifies that the API key from .env is loaded without needing user input."""
        effective_key = self.engine.get_effective_key()
        self.assertTrue(bool(effective_key and len(effective_key) > 10))
        self.assertTrue(self.engine.has_valid_api_key())

    def test_missing_api_key_returns_explicit_error_without_dummy_data(self):
        """Verifies that missing/invalid API key returns success: False and empty jobs."""
        res_blank = self.engine.search_career_portals(
            role="SWE Intern",
            location="Remote",
            api_key="SHORT"
        )
        self.assertFalse(res_blank["success"])
        self.assertIn("error", res_blank)
        self.assertEqual(res_blank["urls"], [])
        self.assertEqual(res_blank["results"], [])

    def test_keyword_prioritization_in_skills(self):
        """Verifies that user-requested keywords are prioritized at the front of skills list and explicit reasons are generated."""
        skills, score, reasons = self.engine.detect_skills_and_score(
            title="Software Engineering Intern",
            snippet="We are looking for a Python and FastAPI developer with Docker experience.",
            page_content="",
            requested_keywords="FastAPI, Python",
            role="Software Engineering Intern",
            seniority="Internship"
        )
        self.assertIn("FastAPI", skills)
        self.assertIn("Python", skills)
        self.assertIn(skills[0], ["FastAPI", "Python"])
        self.assertGreaterEqual(score, 90)
        self.assertTrue(any("FastAPI" in r for r in reasons))
        self.assertTrue(any("Python" in r for r in reasons))

    def test_parse_keywords(self):
        """Verifies keyword parsing handles commas, spaces, pluses, and filters stop words."""
        kw = self.engine.parse_keywords("Python, React + TypeScript and PyTorch")
        self.assertIn("Python", kw)
        self.assertIn("React", kw)
        self.assertIn("TypeScript", kw)
        self.assertIn("PyTorch", kw)
        self.assertNotIn("and", kw)

    def test_is_valid_job_url(self):
        """Verifies direct requisitions are accepted and company directory roots are rejected."""
        # Valid requisitions
        self.assertTrue(self.engine.is_valid_job_url("https://boards.greenhouse.io/figma/jobs/123456"))
        self.assertTrue(self.engine.is_valid_job_url("https://jobs.lever.co/stripe/a1b2c3d4-e5f6-7890"))
        self.assertTrue(self.engine.is_valid_job_url("https://jobs.ashbyhq.com/linear/uuid-1234"))
        self.assertTrue(self.engine.is_valid_job_url("https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/USA-CA-Santa-Clara/Software-Engineer_JR19827"))

        # Invalid root company pages
        self.assertFalse(self.engine.is_valid_job_url("https://boards.greenhouse.io/figma"))
        self.assertFalse(self.engine.is_valid_job_url("https://jobs.lever.co/stripe"))
        self.assertFalse(self.engine.is_valid_job_url("https://jobs.lever.co/stripe/"))
        self.assertFalse(self.engine.is_valid_job_url("https://jobs.ashbyhq.com/linear"))
        self.assertFalse(self.engine.is_valid_job_url("https://nvidia.wd5.myworkdayjobs.com/careers"))

    def test_normalize_apply_url(self):
        """Verifies that direct apply links append /apply or #app to navigate straight to the form."""
        # Lever appends /apply
        self.assertEqual(
            self.engine.normalize_apply_url("https://jobs.lever.co/stripe/a1b2c3d4"),
            "https://jobs.lever.co/stripe/a1b2c3d4/apply"
        )
        # Greenhouse appends #app
        self.assertEqual(
            self.engine.normalize_apply_url("https://boards.greenhouse.io/figma/jobs/123456"),
            "https://boards.greenhouse.io/figma/jobs/123456#app"
        )
        # Workday strips volatile tracking parameters
        clean_wd = self.engine.normalize_apply_url(
            "https://nvidia.wd5.myworkdayjobs.com/job/JR123?session=xyz123&client_id=456&source=LinkedIn"
        )
        self.assertNotIn("session=", clean_wd)
        self.assertNotIn("client_id=", clean_wd)
        self.assertNotIn("source=", clean_wd)

    def test_company_extraction(self):
        """Verifies accurate company extraction across Greenhouse, Lever, Ashby, Workday."""
        self.assertEqual(
            self.engine.extract_company_from_url_or_title("https://job-boards.greenhouse.io/akunacapital/jobs/8018853", "SWE Intern"),
            "Akunacapital"
        )
        self.assertEqual(
            self.engine.extract_company_from_url_or_title("https://jobs.lever.co/linear/123", "Product Engineer"),
            "Linear"
        )
        self.assertEqual(
            self.engine.extract_company_from_url_or_title("https://jobs.ashbyhq.com/openai/456", "Research Intern"),
            "Openai"
        )

if __name__ == "__main__":
    unittest.main()
