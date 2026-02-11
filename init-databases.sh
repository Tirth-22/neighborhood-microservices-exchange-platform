#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE auth_db;
    CREATE DATABASE neighborhood_user_db;
    CREATE DATABASE neighborhood_request_db;
    CREATE DATABASE provider_db;
    CREATE DATABASE notification_db;
EOSQL