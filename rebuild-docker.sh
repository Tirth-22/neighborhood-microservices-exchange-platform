#!/bin/bash

# Stop and remove all containers
docker-compose down

# Remove old images
docker-compose rm -f

# Rebuild all services
docker-compose build --no-cache

# Start all services
docker-compose up -d

# Show logs
docker-compose logs -f
