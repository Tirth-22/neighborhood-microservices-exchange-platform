@echo off
echo ========================================
echo QUICK REBUILD - PROVIDER SERVICE ONLY
echo ========================================

cd /d T:\github-main\new-main\neighborhood-microservices-exchange-platform

echo.
echo [1/2] Rebuilding provider-service container...
docker-compose build provider-service

echo.
echo [2/2] Restarting provider-service...
docker-compose up -d provider-service

echo.
echo ========================================
echo DONE - Check logs below:
echo ========================================
timeout /t 2 /nobreak >nul
docker logs -f provider-service
