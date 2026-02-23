#!/bin/bash

echo "========================================"
echo "Rebuilding Provider Service"
echo "========================================"

cd provider-service

echo ""
echo "[1/4] Cleaning previous build..."
./mvnw clean

echo ""
echo "[2/4] Building JAR..."
./mvnw package -DskipTests

echo ""
echo "[3/4] Stopping provider-service container..."
docker-compose -f ../docker-compose.yml stop provider-service

echo ""
echo "[4/4] Rebuilding and starting provider-service..."
docker-compose -f ../docker-compose.yml up -d --build provider-service

echo ""
echo "========================================"
echo "Provider Service Rebuilt Successfully"
echo "========================================"
echo ""
echo "Viewing logs (Ctrl+C to exit)..."
docker-compose -f ../docker-compose.yml logs -f provider-service
