# Database Management with PgAdmin

## Access PgAdmin

Open your browser and navigate to:
```
http://localhost:5050
```

## Login Credentials
- **Email**: admin@admin.com
- **Password**: admin

## Database Connection Details

Once logged in, the database should be auto-registered with the following details:

**Server Name**: Neighborhood PostgreSQL
**Host**: postgres
**Port**: 5432
**Maintenance Database**: postgres
**Username**: postgres
**Password**: Tirth_22

## Manual Registration (if auto-registration doesn't work)

1. Click on "Register" in the top navigation
2. Click "Server"
3. Fill in the following information:

### General Tab:
- **Name**: Neighborhood PostgreSQL

### Connection Tab:
- **Host name/address**: postgres
- **Port**: 5432
- **Maintenance database**: postgres
- **Username**: postgres
- **Password**: Tirth_22
- **Save password?**: Yes

4. Click "Save"

## Available Databases

- **postgres**: Main database containing all application tables

### Tables in `postgres` database:
- `users` - User accounts from auth-service (username, email, password, role)
- `requests` - Service requests
- `providers` - Service providers
- `notifications` - Notification records

## Common Tasks

### View All Users
```sql
SELECT * FROM users;
```

### View Specific User
```sql
SELECT * FROM users WHERE username = 'your_username';
```

### Delete a User
```sql
DELETE FROM users WHERE username = 'your_username';
```

### Reset User Password
```sql
UPDATE users SET password = 'new_hashed_password' WHERE username = 'your_username';
```

## Docker Container Info

PgAdmin Container: `pgadmin`
PostgreSQL Container: `postgres`
Network: `neighborhood-microservices-exchange-platform_default`

## Troubleshooting

If the database connection fails:
1. Ensure PostgreSQL is running: `docker ps | grep postgres`
2. Verify the password is correct: Check `.env` file for `POSTGRES_PASSWORD`
3. Check network connectivity: `docker network ls`
4. View PostgreSQL logs: `docker logs postgres`
