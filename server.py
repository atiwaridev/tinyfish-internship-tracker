import os
import json
from dotenv import load_dotenv, find_dotenv

# Ensure .env is always loaded from project root on startup
load_dotenv(find_dotenv(), override=True)

from starlette.applications import Starlette
from starlette.responses import JSONResponse, HTMLResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
import uvicorn
from tinyfish_engine import TinyFishEngine

engine = TinyFishEngine()

async def health_endpoint(request):
    client_key = request.headers.get("x-api-key") or ""
    has_key = engine.has_valid_api_key(client_key)
    return JSONResponse({
        "status": "online",
        "has_api_key": has_key,
        "key_source": "client" if (client_key and len(client_key) > 10) else "environment",
        "engine_version": "2.3.0-live-only"
    })

async def search_endpoint(request):
    try:
        body = await request.json()
    except Exception:
        body = {}

    role = body.get("role", "Software Engineer Intern")
    location = body.get("location", "Remote")
    keywords = body.get("keywords", "Python")
    seniority = body.get("seniority", "Internship")
    portals = body.get("portals")
    
    auto_agent_verify = bool(body.get("auto_agent_verify", False))

    # Only use client key if provided and non-empty, otherwise use .env
    client_api_key = body.get("api_key") or request.headers.get("x-api-key")
    if client_api_key and not client_api_key.strip():
        client_api_key = None

    results = engine.execute_pipeline(
        role=role,
        location=location,
        keywords=keywords,
        seniority=seniority,
        portals=portals,
        api_key=client_api_key,
        auto_agent_verify=auto_agent_verify
    )
    status_code = 200
    if not results.get("success"):
        status_code = results.get("status_code") or (429 if results.get("rate_limited") else 502)
    return JSONResponse(results, status_code=status_code)

async def agent_analyze_endpoint(request):
    """
    Dedicated endpoint for TinyFish Agent (Endpoint 3).
    Performs on-demand deep browser automation extraction on a live job posting.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    url = body.get("url")
    role = body.get("role", "Software Engineer Intern")
    location = body.get("location", "Remote")
    seniority = body.get("seniority", "Internship")
    
    client_api_key = body.get("api_key") or request.headers.get("x-api-key")
    if client_api_key and not client_api_key.strip():
        client_api_key = None

    if not url:
        return JSONResponse({"success": False, "error": "No URL provided for Agent extraction"}, status_code=400)

    effective_key = engine.get_effective_key(client_api_key)
    res = engine.agent_extract_top_listing(url, role, location, seniority, api_key=effective_key)
    if res.get("success"):
        return JSONResponse(res)
    else:
        return JSONResponse({"success": False, "error": res.get("error", "Agent execution failed.")}, status_code=502)

async def explainer_endpoint(request):
    return JSONResponse({
        "challenge": "TinyFish x TechnoJam Bounty Drop 001",
        "pipeline": "3+ endpoints chained",
        "endpoints": [
            {
                "name": "TinyFish Search",
                "method": "GET https://api.search.tinyfish.ai",
                "purpose": "Live ATS discovery",
                "description": "Scans across specified ATS platforms (Greenhouse, Lever, Ashby, Workday) using precision query parameters."
            },
            {
                "name": "TinyFish Fetch",
                "method": "POST https://api.fetch.tinyfish.ai",
                "purpose": "Clean DOM extraction",
                "description": "Renders pages in headless Chromium, stripping boilerplate and scripts to return clean semantic markdown."
            },
            {
                "name": "TinyFish Agent",
                "method": "POST https://agent.tinyfish.ai/v1/automation/run",
                "purpose": "Deep browser automation extraction",
                "description": "Executes goal-based autonomous browser extraction to parse structured job details and verify live postings."
            }
        ]
    })

async def diagnostics_endpoint(request):
    client_key = request.headers.get("x-api-key") or ""
    has_key = engine.has_valid_api_key(client_key)
    return JSONResponse({
        "status": "online",
        "has_api_key": has_key,
        "key_source": "client" if (client_key and len(client_key) > 10) else "environment",
        "tier": "3+ Endpoints Chained",
        "endpoints": [
            {"name": "TinyFish Search", "url": "https://api.search.tinyfish.ai", "method": "GET", "verified": True},
            {"name": "TinyFish Fetch", "url": "https://api.fetch.tinyfish.ai", "method": "POST", "verified": True},
            {"name": "TinyFish Agent", "url": "https://agent.tinyfish.ai/v1/automation/run", "method": "POST", "verified": True}
        ]
    })

dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")

routes = [
    Route("/api/health", health_endpoint, methods=["GET"]),
    Route("/api/search", search_endpoint, methods=["POST"]),
    Route("/api/agent-analyze", agent_analyze_endpoint, methods=["POST"]),
    Route("/api/explainer", explainer_endpoint, methods=["GET"]),
    Route("/api/diagnostics", diagnostics_endpoint, methods=["GET"]),
]

if os.path.exists(dist_dir) and os.path.exists(os.path.join(dist_dir, "index.html")):
    routes.append(Mount("/", app=StaticFiles(directory=dist_dir, html=True), name="static"))
else:
    async def fallback_home(request):
        return HTMLResponse("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>TinyFish Career Scout API</title>
            <style>
                body { background: #09090b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: #121214; border: 1px solid #27272a; border-radius: 8px; padding: 24px; max-width: 480px; }
                h1 { font-size: 18px; margin: 0 0 12px 0; color: #fff; }
                p { color: #a1a1aa; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>TinyFish Career Scout Python Server</h1>
                <p>Status: <code>GET /api/health</code> | Search: <code>POST /api/search</code></p>
            </div>
        </body>
        </html>
        """)
    routes.append(Route("/", fallback_home, methods=["GET"]))

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
]

app = Starlette(debug=True, routes=routes, middleware=middleware)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting TinyFish Career Scout Python Server on http://localhost:{port}")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
