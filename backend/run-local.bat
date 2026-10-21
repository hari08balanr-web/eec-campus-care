@echo off
setlocal
echo ========================================================
echo   Starting EEC Care Backend (FORCE LOCAL / CAMPUS WI-FI)
echo ========================================================
echo Checking and freeing port 8080...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; Start-Sleep -Milliseconds 300"
echo Starting in LOCAL profile (Offline H2)...
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
