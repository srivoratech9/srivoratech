@echo off
echo ===================================================
echo   SriVoraTech Website - Full Setup and Launcher
echo ===================================================
echo.
echo 1. Installing dependencies (npm install)...
echo.
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] npm install failed. Please ensure Node.js is installed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo   Dependencies installed successfully!
echo   Starting Backend Server (port 3001) + Frontend (port 5173)...
echo ===================================================
echo.

REM Start backend server in background
start "SriVoraTech Backend" /min cmd /c "node server.js"
echo [OK] Backend server started on http://localhost:3001

REM Wait 2 seconds for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend dev server
echo [OK] Starting frontend on http://localhost:5173
call npm run dev

pause
