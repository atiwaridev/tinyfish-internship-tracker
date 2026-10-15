#!/usr/bin/env python3
"""
Test script to verify live connectivity to TinyFish Search, Fetch, and Agent APIs.
Run with: ./venv/bin/python test_live_api.py
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("TINYFISH_API_KEY", "").strip()

print("=" * 60)
print("TinyFish Live API Diagnostics")
print("=" * 60)
print(f"API Key: {api_key[:12]}... (length: {len(api_key)})")

headers = {
    "X-API-Key": api_key,
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# 1. Search
print("\n[1/3] Testing TinyFish Search (GET https://api.search.tinyfish.ai)...")
try:
    r = requests.get(
        "https://api.search.tinyfish.ai",
        headers=headers,
        params={
            "query": "Software Engineer Intern Python",
            "include_domains": "job-boards.greenhouse.io,boards.greenhouse.io,jobs.lever.co,jobs.ashbyhq.com"
        },
        timeout=15
    )
    print(f"HTTP Status: {r.status_code}")
    if r.status_code == 200:
        results = r.json().get("results", [])
        print(f"Found {len(results)} live job postings:")
        for i, item in enumerate(results[:3]):
            print(f"  {i+1}. {item.get('title')} ({item.get('url')})")
    else:
        print("Response:", r.text[:300])
except Exception as e:
    print(f"Search Error: {e}")

# 2. Fetch
print("\n[2/3] Testing TinyFish Fetch (POST https://api.fetch.tinyfish.ai)...")
test_url = "https://job-boards.greenhouse.io/akunacapital/jobs/8018853"
try:
    r = requests.post(
        "https://api.fetch.tinyfish.ai",
        headers=headers,
        json={"urls": [test_url], "format": "markdown"},
        timeout=25
    )
    print(f"HTTP Status: {r.status_code}")
    if r.status_code == 200:
        res = r.json().get("results", [])
        print(f"Fetched {len(res)} pages. First page title: '{res[0].get('title')}'")
        text_preview = (res[0].get("text") or "")[:200].replace("\n", " ")
        print(f"Content preview: {text_preview}...")
    else:
        print("Response:", r.text[:300])
except Exception as e:
    print(f"Fetch Error: {e}")

# 3. Agent
print("\n[3/3] Testing TinyFish Agent (POST https://agent.tinyfish.ai/v1/automation/run)...")
try:
    r = requests.post(
        "https://agent.tinyfish.ai/v1/automation/run",
        headers=headers,
        json={
            "url": test_url,
            "goal": "Extract job title, company name, and apply link as JSON."
        },
        timeout=30
    )
    print(f"HTTP Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"Agent Run ID: {data.get('run_id')}")
        print(f"Agent Status: {data.get('status')}")
        print(f"Agent Result: {data.get('result')}")
    else:
        print("Response:", r.text[:300])
except Exception as e:
    print(f"Agent Error: {e}")

print("\n" + "=" * 60)
print("Diagnostics Complete.")
print("=" * 60)
