# Registration & Database Flow

## ✅ System Architecture (Now Fixed)

### Data Flow for User Registration:

```
Browser → NGINX Frontend (port 80)
    ↓
NGINX Proxy: `/api/auth/register` → `api-gateway:8080`
    ↓
API Gateway (port 8080) 
    Route: `/auth/**` → `AUTH-SERVICE` (Eureka Load Balanced)
    ↓
Auth-Service (port 8081)
    Registers in Eureka: `AUTH-SERVICE`
    ↓
Database Connection
    PostgreSQL (port 5432)
    JDBC: `jdbc:postgresql://postgres:5432/postgres`
    User: `postgres` / Password: `Tirth_22`
    ↓
Insert into `users` table:
    - username
    - email
    - password (encrypted)
    - role
```

## How the Fixed Setup Works

### 1. Frontend Changes (Dockerfile)
- **API Base URL**: Now set to `/api` (relative path)
- **NGINX Proxy**: Proxies all `/api/` requests to `api-gateway:8080`
- **Benefits**: 
  - No CORS issues (same origin)
  - No hardcoded localhost URLs
  - Works seamlessly in Docker network

### 2. API Gateway Routes
```yaml
- id: auth-service
  uri: lb://AUTH-SERVICE
  predicates:
    - Path=/auth/**
```
- Routes `/auth/register` → AUTH-SERVICE
- Uses Eureka load balancer: `lb://`
- AUTH-SERVICE automatically registers with Eureka on startup

### 3. Auth-Service Database
```properties
spring.datasource.url=jdbc:postgresql://postgres:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=Tirth_22
spring.jpa.hibernate.ddl-auto=update
```
- Automatically creates/updates `users` table on startup
- Stores all user registrations with encrypted passwords

## Testing Registration

### Step 1: Access Frontend
```
http://localhost
```

### Step 2: Fill Registration Form
- Username: `jayBhaijay` (min 6 chars)
- Email: `jay@gmail.com`
- Password: `testpass123` (min 6 chars)
- Role: `User (Looking for help)` or `User (Offering help)`

### Step 3: Click "Create Account"
The request flow:
1. Frontend: `POST /api/auth/register`
2. NGINX: Proxies to `http://api-gateway:8080/auth/register`
3. API Gateway: Routes to auth-service via Eureka
4. Auth-Service: Validates and stores in PostgreSQL
5. Success: "Registration successful! Please login."

## Verify Data in Database

### Using PgAdmin (http://localhost:5050)
1. Login: `admin@admin.com` / `admin`
2. Navigate to: Servers → Neighborhood PostgreSQL → postgres → Schemas → public → Tables → users
3. Right-click users → View/Edit Data

### Using SQL Query
```sql
SELECT username, email, role FROM users;
```

### Using Docker CLI
```bash
docker exec postgres psql -U postgres -d postgres -c "SELECT * FROM users;"
```

## Common Issues & Solutions

### "Registration failed. Server unavailable or Gateway Error"
**Now Fixed!** Previously had CORS/routing issues. Current fixes:
- ✅ NGINX properly proxies API requests
- ✅ CORS headers configured in API Gateway
- ✅ Auth-service properly registered with Eureka
- ✅ Database credentials correct

### User Not Appearing in Database
1. Check auth-service logs: `docker logs auth-service`
2. Verify database connection: `docker logs auth-service | grep -i "connection\|connected"`
3. Check if table exists: Log into PgAdmin and view users table

### Cannot Connect to PgAdmin
1. Verify PostgreSQL is running: `docker-compose ps | grep postgres`
2. Check database credentials in `.env` file
3. Default PgAdmin: `http://localhost:5050`
4. Already has Neighborhood PostgreSQL server configured

## Services & Ports Summary

| Service | Port | Status | Notes |
|---------|------|--------|-------|
| Frontend | 80 | ✅ | NGINX with API proxy |
| API Gateway | 8080 | ✅ | Healthy |
| Auth-Service | 8081 | ✅ | Registered with Eureka |
| PostgreSQL | 5432 | ✅ | Database |
| PgAdmin | 5050 | ✅ | DB Management |
| Config-Server | 8888 | ✅ | Configuration |
| Eureka-Server | 8761 | ✅ | Service Registry |

## Important Files

- **Frontend Dockerfile**: `/Frontend/Dockerfile` - NGINX proxy configuration
- **API Gateway Config**: `/config-repo/api-gateway-docker.yml` - Routes
- **Auth-Service Config**: `/config-repo/auth-service-docker.yml` - Database connection
- **Environment File**: `/.env` - Database credentials

---

**All systems are now properly configured and connected!** 🎉
