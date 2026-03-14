@echo off

echo Stopping all containers...
docker-compose down

echo Rebuilding all services...
docker-compose build --no-cache

echo Starting all services...
docker-compose up -d

