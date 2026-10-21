@echo off
cd /d "%~dp0backend"
echo ========================================================
echo   Starting EEC Care Java Backend
echo ========================================================
powershell -Command "$p = (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue).OwningProcess; if ($p) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue; Write-Host 'Freed port 8080.' } else { Write-Host 'Port 8080 is clear.' }"
mvn spring-boot:run
pause
