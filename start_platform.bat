@echo off
echo ===================================================================
echo   VARSHAAI - Regime-Aware Rainfall Intelligence & Forecast Correction
echo ===================================================================
echo.
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000...
start "VARSHAAI Backend" cmd /k "cd /d %~dp0 && .venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting React + Vite Frontend on http://localhost:5173...
start "VARSHAAI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers successfully dispatched in background windows!
echo Open your browser to: http://localhost:5173
echo Backend API Docs:    http://127.0.0.1:8000/docs
echo ===================================================================
pause
