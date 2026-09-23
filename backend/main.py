"""
VARSHAAI — Backend API Gateway & Production Web Server
FastAPI Application serving all 10 modules of the VARSHAAI platform,
with built-in production hosting for the React frontend (Render-ready).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
import sys

# Ensure backend and ml_engine are in PYTHONPATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, "..", "ml_engine"))

from routes.predict import router as predict_router
from routes.regimes import router as regimes_router
from routes.map_layers import router as map_router
from routes.risk import router as risk_router
from routes.explain import router as explain_router
from routes.verification import router as verification_router
from routes.historical import router as historical_router
from routes.health import router as health_router
from routes.hydro import router as hydro_router
from routes.emergency import router as emergency_router
from routes.copilot import router as copilot_router

app = FastAPI(
    title="VARSHAAI — Regime-Aware Rainfall Intelligence Platform",
    description="Regime-Aware Rainfall Intelligence & Forecast Correction Platform API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all route modules under /api
app.include_router(predict_router)
app.include_router(regimes_router)
app.include_router(map_router)
app.include_router(risk_router)
app.include_router(explain_router)
app.include_router(verification_router)
app.include_router(historical_router)
app.include_router(health_router)
app.include_router(hydro_router)
app.include_router(emergency_router)
app.include_router(copilot_router)

@app.get("/api")
def api_root():
    return {
        "platform": "VARSHAAI",
        "description": "Regime-Aware Rainfall Intelligence & Forecast Correction Platform",
        "status": "ONLINE",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

# Production Static Hosting: Serve React frontend from frontend/dist
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    # Mount assets folder
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Catch-all route to serve index.html for React SPA client-side routing
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes or docs
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
