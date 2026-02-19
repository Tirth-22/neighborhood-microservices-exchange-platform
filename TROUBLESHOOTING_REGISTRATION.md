# Registration & Database Troubleshooting Guide

## Issues Fixed

### 1. NGINX Proxy Configuration ✅
**Problem**: The NGINX configuration in `Frontend/Dockerfile` was using an upstream block that might not resolve correctly in Docker networks.

**Fix**: Changed from using an upstream block to directly referencing the Docker service name:
```nginx
proxy_pass http://api-gateway:8080/;
```

**Additional improvements**:
- Added timeout configurations for better error handling
- Simplified configuration for better reliability

### 2. PgAdmin Server Configuration ✅
**Problem**: PgAdmin wasn't automatically configured with the PostgreSQL server connection.

**Fix**: Added volume mount for `pgadmin-servers.json` in `docker-compose.yml`:
```yaml
volumes:
  - pgadmin_data:/var/lib/pgadmin
  - ./pgadmin-servers.json:/pgadmin4/servers.json
```

## Request Flow Verification

The registration request should flow as follows:

```
Browser (http://localhost)
  ↓ POST /api/auth/register
NGINX Frontend (port 80)
  ↓ Strips /api/, forwards /auth/register
API Gateway (port 8080, api-gateway:8080)
  ↓ Routes /auth/** → lb://AUTH-SERVICE
Eureka Service Discovery
  ↓ Finds AUTH-SERVICE instance
Auth-Service (port 8081)
  ↓ POST /auth/register
PostgreSQL Database (postgres:5432)
  ↓ INSERT INTO users table
```

## Steps to Fix Registration Issue

### Step 1: Rebuild Frontend Container
Since we modified the `Frontend/Dockerfile`, you need to rebuild the frontend:

```bash
docker-compose build frontend
docker-compose up -d frontend
```

### Step 2: Restart All Services (Recommended)
To ensure all changes take effect:

```bash
docker-compose down
docker-compose up -d
```

### Step 3: Verify Services Are Running
```bash
docker-compose ps
```

All services should show as "Up" and healthy.

### Step 4: Check Service Logs
If registration still fails, check the logs:

```bash
# Check API Gateway logs
docker logs api-gateway --tail 100

# Check Auth Service logs
docker logs auth-service --tail 100

# Check Frontend logs
docker logs frontend --tail 100
```

### Step 5: Verify Eureka Registration
1. Open http://localhost:8761 in your browser
2. Check that `AUTH-SERVICE` is registered
3. Verify the status shows "UP"

### Step 6: Test API Gateway Directly
Test if the API Gateway can reach auth-service:

```bash
# Test from within the Docker network
docker exec api-gateway curl http://auth-service:8081/auth/test
```

Expected response: "Auth service is working"

### Step 7: Test Registration Endpoint
Test the registration endpoint directly:

```bash
# Test registration endpoint
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "password": "testpass123",
    "role": "USER"
  }'
```

## Database Connection Verification

### Step 1: Verify PostgreSQL is Running
```bash
docker ps | grep postgres
```

### Step 2: Check Database Connection from Auth-Service
```bash
docker logs auth-service | grep -i "database\|connection\|jdbc"
```

Look for messages like:
- "HikariPool-1 - Starting..."
- "HikariPool-1 - Start completed."

### Step 3: Verify Database Credentials
Ensure your `.env` file has correct database credentials:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Tirth_22
POSTGRES_DB=postgres
DB_USERNAME=postgres
DB_PASSWORD=Tirth_22
```

**Important**: `DB_PASSWORD` must match `POSTGRES_PASSWORD` for services to connect.

### Step 4: Access PgAdmin
1. Open http://localhost:5050
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin`
3. The "Neighborhood PostgreSQL" server should be pre-configured
4. If not visible, manually add it:
   - Host: `postgres`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `Tirth_22`

### Step 5: Verify Users Table Exists
In PgAdmin, navigate to:
- Servers → Neighborhood PostgreSQL → postgres → Schemas → public → Tables → users

If the table doesn't exist, check auth-service logs for Hibernate DDL errors.

### Step 6: Check if Data is Being Stored
After attempting registration, run:

```sql
SELECT * FROM users;
```

Or via Docker:
```bash
docker exec postgres psql -U postgres -d postgres -c "SELECT username, email, role FROM users;"
```

## Common Issues & Solutions

### Issue: "Registration failed. Server unavailable or Gateway Error"

**Possible Causes:**
1. API Gateway not routing correctly
2. Auth-service not registered with Eureka
3. Network connectivity issues between containers
4. Database connection failure

**Solutions:**
1. Verify Eureka shows AUTH-SERVICE as UP
2. Check API Gateway logs for routing errors
3. Verify all containers are on the same Docker network
4. Check database connection in auth-service logs

### Issue: User Not Appearing in Database

**Possible Causes:**
1. Database connection failed silently
2. Transaction rolled back due to constraint violation
3. Wrong database credentials

**Solutions:**
1. Check auth-service logs for database errors
2. Verify username/email uniqueness (check for duplicates)
3. Verify database credentials match in `.env` and config files

### Issue: Cannot Connect to PgAdmin

**Possible Causes:**
1. PgAdmin container not running
2. Port 5050 already in use
3. Browser cache issues

**Solutions:**
1. `docker ps | grep pgadmin` - verify it's running
2. Check if port 5050 is available: `netstat -an | grep 5050`
3. Try incognito/private browsing mode
4. Clear browser cache

### Issue: Services Not Registering with Eureka

**Possible Causes:**
1. Eureka server not healthy
2. Config server not accessible
3. Network issues

**Solutions:**
1. Check Eureka health: http://localhost:8761/actuator/health
2. Verify config-server is healthy
3. Check service logs for Eureka registration errors
4. Ensure `SPRING_PROFILES_ACTIVE=docker` is set

## Environment Variables Checklist

Ensure your `.env` file contains:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Tirth_22
POSTGRES_DB=postgres
POSTGRES_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Tirth_22

# JWT
JWT_SECRET=your-secret-key-min-32-characters-long

# Spring Profile
SPRING_PROFILES_ACTIVE=docker

# Ports (if different from defaults)
CONFIG_SERVER_PORT=8888
EUREKA_SERVER_PORT=8761
API_GATEWAY_PORT=8080
```

## Testing Registration After Fixes

1. **Clear browser cache** or use incognito mode
2. Navigate to http://localhost
3. Go to Sign Up page
4. Fill in the form:
   - Username: `testuser123` (min 6 characters)
   - Email: `test@example.com`
   - Password: `testpass123` (min 6 characters)
   - Role: Select "User (Looking for help)" or "Provider (Providing help)"
5. Click "Create Account"
6. Expected: Success message and redirect to login
7. Verify in PgAdmin: Check `users` table for new entry

## Next Steps if Still Not Working

1. **Check all logs simultaneously:**
   ```bash
   docker-compose logs -f api-gateway auth-service frontend
   ```

2. **Test network connectivity:**
   ```bash
   docker exec frontend ping api-gateway
   docker exec api-gateway ping auth-service
   docker exec auth-service ping postgres
   ```

3. **Verify configuration files:**
   - Check `config-repo/auth-service-docker.yml`
   - Verify database URL: `jdbc:postgresql://postgres:5432/postgres`
   - Verify Eureka URL: `http://eureka-server:8761/eureka/`

4. **Check for port conflicts:**
   ```bash
   netstat -an | grep -E "80|8080|5432|5050|8761"
   ```

## Summary of Changes Made

1. ✅ Fixed NGINX proxy configuration in `Frontend/Dockerfile`
2. ✅ Added pgAdmin servers.json mount in `docker-compose.yml`
3. ✅ Improved proxy timeout settings for better error handling

After applying these fixes and rebuilding, registration should work and data should be stored in PostgreSQL, accessible via PgAdmin at http://localhost:5050/browser/.
