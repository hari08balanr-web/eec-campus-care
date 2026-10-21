@echo off
title Launch EEC Care System
echo ========================================================
echo   Launching EEC Care - Backend & Frontend
echo ========================================================
echo.
echo 1. Launching Java Spring Boot Backend (Port 8080)...
start "EEC Care - Java Backend (Port 8080)" cmd.exe /k "cd /d "%~dp0backend" && run.bat"

echo 2. Launching React Frontend (Port 5173)...
start "EEC Care - React Frontend (Port 5173)" cmd.exe /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo   Both servers launched in their own terminal windows!
echo   Wait a few seconds, then open: http://localhost:5173
echo ========================================================
timeout /t 5 >nul
