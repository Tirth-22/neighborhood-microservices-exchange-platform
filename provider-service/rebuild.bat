@echo off
echo ========================================
echo REBUILDING PROVIDER SERVICE
echo ========================================

cd /d T:\github-main\new-main\neighborhood-microservices-exchange-platform\provider-service

echo.
echo [1/3] Cleaning previous build...
call mvn clean

echo.
echo [2/3] Building with tests skipped...
call mvn package -DskipTests

echo.
echo [3/3] Restarting service...
docker-compose restart provider-service

echo.
echo ========================================
echo BUILD COMPLETE
echo ========================================
echo.
echo Check logs with:
echo docker logs -f provider-service
echo.
pause
