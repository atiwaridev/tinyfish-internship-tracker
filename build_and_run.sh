#!/usr/bin/env bash
set -e

echo "=================================================="
echo "   TinyFish Career Scout - TechnoJam Drop 001"
echo "   Pipeline: Search + Fetch + Agent"
echo "=================================================="

# Check Python environment
if [ -d "venv" ]; then
    PYTHON_CMD="./venv/bin/python"
else
    PYTHON_CMD="python3"
fi

# Build frontend if dist doesn't exist
if [ ! -d "frontend/dist" ]; then
    echo "Building frontend bundle..."
    npm run build --prefix frontend
fi

echo "Starting Python Server on http://localhost:8000..."
$PYTHON_CMD server.py
