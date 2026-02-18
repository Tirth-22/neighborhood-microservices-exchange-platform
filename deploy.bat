@echo off
REM Neighborhood Microservices Exchange Platform - Docker Deployment Script (Windows)
REM This script helps set up and deploy the application in different environments

setlocal enabledelayedexpansion

REM Colors and formatting
set "RESET=[0m"
set "BLUE=[34m"
set "GREEN=[32m"
set "RED=[31m"
set "YELLOW=[33m"

REM Configuration
set "ENV_FILE=.env"
set "ENV_EXAMPLE=.env.example"

REM Functions
:main
echo.
echo %BLUE%======================================== Windows Deployment Script ========================================%RESET%
echo.

call :check_docker
call :check_docker_compose

:menu
echo.
echo %BLUE%=== Neighborhood Microservices Exchange Platform ===%RESET%
echo 1. Deploy Development Environment
echo 2. Deploy Production Environment
echo 3. Stop Services
echo 4. Stop All ^(including volumes^)
echo 5. View Logs
echo 6. Check Service Health
echo 7. Build Specific Service
echo 8. Restart Specific Service
echo 9. Setup .env File
echo 0. Exit
echo.
set /p choice="Select an option (0-9): "

if "%choice%"=="0" goto exit_script
if "%choice%"=="1" goto deploy_dev
if "%choice%"=="2" goto deploy_prod
if "%choice%"=="3" goto stop_services
if "%choice%"=="4" goto stop_all
if "%choice%"=="5" goto view_logs
if "%choice%"=="6" goto check_health
if "%choice%"=="7" goto build_service
if "%choice%"=="8" goto restart_service
if "%choice%"=="9" goto setup_env
echo Invalid option. Please try again.
goto menu

:deploy_dev
echo %BLUE%========================================%RESET%
echo %BLUE%Starting Development Environment%RESET%
echo %BLUE%========================================%RESET%
if not exist "%ENV_FILE%" (
    echo %RED%Error: .env file not found%RESET%
    call :setup_env
)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
goto menu

:deploy_prod
echo %BLUE%========================================%RESET%
echo %BLUE%Starting Production Environment%RESET%
echo %BLUE%========================================%RESET%
set "ENV_PROD=.env.prod"
if not exist "%ENV_PROD%" (
    echo %RED%Error: .env.prod file not found%RESET%
    set /p create="Create from .env.example? (y/n): "
    if /i "%create%"=="y" (
        copy "%ENV_EXAMPLE%" "%ENV_PROD%"
        echo %YELLOW%EDIT .env.prod WITH PRODUCTION CREDENTIALS BEFORE DEPLOYMENT!%RESET%
        goto menu
    ) else (
        goto menu
    )
)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file "%ENV_PROD%" up -d
echo %GREEN%Production deployment started in background%RESET%
goto menu

:stop_services
echo %BLUE%========================================%RESET%
echo %BLUE%Stopping Services%RESET%
echo %BLUE%========================================%RESET%
docker-compose down
echo %GREEN%Services stopped%RESET%
goto menu

:stop_all
echo %BLUE%========================================%RESET%
echo %BLUE%Stopping All Services and Removing Volumes%RESET%
echo %BLUE%========================================%RESET%
docker-compose down -v
echo %GREEN%All services stopped and volumes removed%RESET%
goto menu

:view_logs
set /p service="Enter service name (or press Enter for all): "
if "%service%"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %service%
)
goto menu

:check_health
echo %BLUE%========================================%RESET%
echo %BLUE%Checking Service Health%RESET%
echo %BLUE%========================================%RESET%
docker-compose ps
echo.
echo %BLUE%Checking health status...%RESET%
for %%s in (postgres config-server eureka-server api-gateway) do (
    for /f %%H in ('docker ps -q -f name=%%s') do (
        echo %%s: Running
    )
)
goto menu

:build_service
set /p service="Enter service name: "
if "%service%"=="" (
    echo %RED%Please specify a service name%RESET%
) else (
    docker-compose build %service%
    echo %GREEN%Service %service% built%RESET%
)
goto menu

:restart_service
set /p service="Enter service name: "
if "%service%"=="" (
    echo %RED%Please specify a service name%RESET%
) else (
    docker-compose restart %service%
    echo %GREEN%Service %service% restarted%RESET%
)
goto menu

:setup_env
echo %BLUE%========================================%RESET%
echo %BLUE%Setting up Environment Variables%RESET%
echo %BLUE%========================================%RESET%

if exist "%ENV_FILE%" (
    echo %YELLOW%Existing .env file found%RESET%
    set /p overwrite="Do you want to overwrite it? (y/n): "
    if /i not "%overwrite%"=="y" (
        echo %YELLOW%Keeping existing .env file%RESET%
        goto menu
    )
)

copy "%ENV_EXAMPLE%" "%ENV_FILE%"
echo %GREEN%.env file created from .env.example%RESET%
echo %YELLOW%Please edit .env and set your secure passwords!%RESET%
echo.
echo Environment variables configured
echo %YELLOW%You must edit .env with secure passwords before running deployment%RESET%
goto menu

:check_docker
where docker >nul 2>nul
if errorlevel 1 (
    echo %RED%Error: Docker is not installed. Please install Docker Desktop first.%RESET%
    exit /b 1
)
echo %GREEN%Docker is installed%RESET%
exit /b 0

:check_docker_compose
where docker-compose >nul 2>nul
if errorlevel 1 (
    echo %RED%Error: Docker Compose is not installed. Please install Docker Compose first.%RESET%
    exit /b 1
)
echo %GREEN%Docker Compose is installed%RESET%
exit /b 0

:exit_script
echo %GREEN%Exiting...%RESET%
endlocal
exit /b 0
