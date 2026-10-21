@echo off
setlocal
title EEC Care Java Backend

echo ========================================================
echo   Starting EEC Care Java Backend
echo ========================================================
echo Checking and freeing port 8080...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; Start-Sleep -Milliseconds 300"

echo Testing connection to Supabase Cloud Database...
node check-network.js >nul 2>&1
if %ERRORLEVEL% EQU 0 goto START_CLOUD
goto START_LOCAL

:START_CLOUD
echo Supabase Cloud is reachable!
echo Starting backend in CLOUD profile...
mvn spring-boot:run "-Dspring-boot.run.profiles=cloud"
goto END

:START_LOCAL
echo Campus Wi-Fi or restricted network detected (Port 5432 blocked).
echo Starting backend in LOCAL profile (Offline H2 Database)...
echo Connect to Mobile Hotspot anytime to use Supabase Cloud.
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
goto END

:END
