# Docker Setup Guide

This project is now fully containerized and can run without JDK/Maven installed on the host machine.

## What Was Fixed

### 1. **Multi-Stage Docker Builds**
   - All Spring Boot services now build JARs inside Docker containers
   - No need for JDK/Maven on host machine
   - Uses Maven wrapper (mvnw) included in each service

### 2. **Frontend Configuration**
   - Fixed directory path: `Frontend` (was incorrectly `frontend`)
   - API URL is now configurable via build args
   - Added nginx configuration for SPA routing

### 3. **Health Checks & Dependencies**
   - Added health checks for PostgreSQL, Config Server, Eureka Server, and API Gateway
   - Services wait for dependencies to be healthy before starting
   - Proper startup order: Config Server → Eureka → Services → API Gateway → Frontend

### 4. **Config Server**
   - Fixed application.yml (was corrupted with docker-compose content)
   - Properly configured native file system repository path

### 5. **Kafka Configuration**
   - Fixed listeners for Docker networking
   - Internal and external listeners properly configured

## Services

- **PostgreSQL**: Database (port 5432)
- **Zookeeper**: Kafka coordination (port 2181)
- **Kafka**: Message broker (port 29092)
- **Config Server**: Configuration management (port 8888)
- **Eureka Server**: Service discovery (port 8761)
- **API Gateway**: Gateway service (port 8080)
- **Auth Service**: Authentication (internal)
- **User Service**: User management (internal)
- **Request Service**: Request handling (internal)
- **Provider Service**: Provider management (internal)
- **Notification Service**: Notifications (internal)
- **Frontend**: React application (port 80)

## How to Run

### Prerequisites
- Docker Desktop installed
- Docker Compose v2 (included with Docker Desktop)

### Start All Services

```bash
docker-compose up --build
```

### Start in Background

```bash
docker-compose up -d --build
```

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway
```

### Rebuild Specific Service

```bash
docker-compose build api-gateway
docker-compose up -d api-gateway
```

## Access Points

- **Frontend**: http://localhost:80
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Config Server**: http://localhost:8888
- **PostgreSQL**: localhost:5432
- **Kafka**: localhost:29092

## Environment Variables

Services use `SPRING_PROFILES_ACTIVE=docker` to load Docker-specific configurations from config-repo.

## Notes

- First build will take time as it downloads dependencies and builds all services
- Subsequent builds will be faster due to Docker layer caching
- All services are built with Java 17 (except user-service which uses Java 21)
- Frontend API URL defaults to `http://localhost:8080` but can be changed via build args

## Troubleshooting

### Services Not Starting
- Check logs: `docker-compose logs <service-name>`
- Ensure ports are not already in use
- Verify health checks are passing: `docker-compose ps`

### Build Failures
- Ensure Docker has enough resources allocated (memory, CPU)
- Check network connectivity for downloading dependencies
- Clear Docker cache if needed: `docker system prune -a`

### Database Connection Issues
- Wait for PostgreSQL health check to pass
- Verify DB_PASSWORD matches in docker-compose.yml and config files
