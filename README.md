# TinyFish Career Scout

> **TinyFish x Team TechnoJam Bounty Drop 001**  
> Workshop: "AI That Clicks." at Galgotias University  
> **Submission Type:** Agentic App / Skill &bull; **Architecture:** 3+ Chained Endpoints

---

## Overview

**TinyFish Career Scout** is an agentic job and internship discovery engine. Instead of manually checking and refreshing dozens of company career pages every week, this tool uses **TinyFish Search, Fetch, and Agent APIs** to scout live openings across major Applicant Tracking Systems (ATS) including **Greenhouse**, **Lever**, **Ashby**, and **Workday**.

The user interface is designed with a **Claude and ChatGPT-inspired clean, minimal aesthetic**, built with **shadcn/ui**, **Tailwind CSS**, and powered by a **Python** core backend with **Pandas** deduplication.

Official Documentation: [docs.tinyfish.ai](https://docs.tinyfish.ai/)

---

## Where to Put Your API Key

Your TinyFish API key is configured directly in the [`.env`](file:///.env) file at the project root:

```env
TINYFISH_API_KEY="your-tinyfish-api-key-here"
```

The application automatically reads this key securely on the backend for all live TinyFish Search, Fetch, and Agent requests. No frontend key entry is required.

---

## Bounty Criteria & Pipeline Architecture

### Multi-Endpoint Pipeline (3+ Endpoints Chained Meaningfully)

| # | Endpoint | Method | Documentation Reference | Role in Pipeline |
|---|---|---|---|---|
| **1** | **TinyFish Search** | `GET https://api.search.tinyfish.ai` | [docs.tinyfish.ai/search-api](https://docs.tinyfish.ai/search-api/reference) | Discovers live career boards across Greenhouse, Lever, Ashby, and Workday using precision ATS queries without hardcoding. |
| **2** | **TinyFish Fetch** | `POST https://api.fetch.tinyfish.ai` | [docs.tinyfish.ai/fetch-api](https://docs.tinyfish.ai/fetch-api/reference) | Headless Chromium rendering that strips boilerplate, scripts, and cookie banners to return clean semantic Markdown. |
| **3** | **TinyFish Agent** | `POST https://agent.tinyfish.ai/v1/automation/run` | [docs.tinyfish.ai/agent-api](https://docs.tinyfish.ai/agent-api/reference) | Reasoning agent that extracts role details, verifies seniority, matches skills, structures JSON, and calculates match scores. |
| **+** | **Pandas Engine** | Data Processing | Python standard | Case-insensitive deduplication by company and title, and ranking positions by relevance score. |

### Submission Requirements Checklist

- [x] **1. Working demo**: Fast, responsive web application runnable with one command via Python.
- [x] **2. User preferences**: Customizable Role, Location, Seniority (Internship, Entry-Level, Junior, Mid-Level), and Keywords.
- [x] **3. Pulls openings from multiple live portals**: Scrapes and extracts from Greenhouse, Lever, Ashby, and Workday.
- [x] **4. Structured, deduplicated listings with links to apply**: Clean job cards and table view with direct apply buttons.
- [x] **5. Short explanation of how TinyFish Search, Fetch and Agent are used**: Dedicated interactive Architecture Modal built directly into the UI.
- [x] **6. A post about your build on LinkedIn and X tagging TinyFish**: Built-in 1-click Social Share drafter with auto-tagged copy and launch buttons.

---

## Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- TinyFish API Key from [agent.tinyfish.ai/api-keys](https://agent.tinyfish.ai/api-keys)

### 2. Configuration
Ensure your API key is present in [`.env`](file:///.env):
```env
TINYFISH_API_KEY="your-tinyfish-api-key-here"
```

### 3. Run the App (Unified Python Server)
Run the automated runner script:
```bash
./build_and_run.sh
```
Or start the Python server directly:
```bash
./venv/bin/python server.py
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## Alternative: Pure Streamlit Mode
If you prefer running the pure Python Streamlit interface:
```bash
./venv/bin/streamlit run app.py
```

---

## Project Structure

```
├── tinyfish_engine.py      # Core Python orchestration engine (Search, Fetch, Agent, Pandas)
├── server.py               # Starlette + Uvicorn server (APIs & static asset host)
├── app.py                  # Streamlit alternative interface with clean styling
├── build_and_run.sh        # Single-command build & runner script
├── requirements.txt        # Python dependencies
├── .env                    # Environment credentials
├── tests/
│   └── test_server.py      # Unit tests for endpoints and engine
└── frontend/               # Claude/ChatGPT-style shadcn/ui React application
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx             # Navbar with API key and info buttons
    │   │   ├── SearchHero.jsx         # Centered command search box
    │   │   ├── PipelineProgress.jsx   # Clean execution stepper
    │   │   ├── JobCard.jsx            # Minimalist job cards with match pills
    │   │   ├── JobTable.jsx           # Monochromatic data table view
    │   │   ├── ApiKeyModal.jsx        # API key management modal
    │   │   ├── ArchitectureModal.jsx  # Req 5 explainer modal
    │   │   └── SocialShareModal.jsx   # Req 6 LinkedIn & X share helper
    │   └── App.jsx
    └── dist/                          # Compiled production assets served by Python
```

---

## Testing

Run automated tests:
```bash
./venv/bin/python -m unittest tests/test_server.py
```
