#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="${1:-./backups}"
RETENTION_DAYS="${2:-14}"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_BASE="${PROJECT_ROOT}/${BACKUP_ROOT}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="${BACKUP_BASE}/${TIMESTAMP}"

if ! docker ps --format '{{.Names}}' | grep -q '^postgres$'; then
  echo "Postgres container 'postgres' is not running. Start stack first: docker-compose up -d" >&2
  exit 1
fi

mkdir -p "${BACKUP_DIR}"

mapfile -t DBS < <(docker exec postgres psql -U postgres -tAc "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname;")

if [ "${#DBS[@]}" -eq 0 ]; then
  echo "No databases found to back up." >&2
  exit 1
fi

for db in "${DBS[@]}"; do
  db="$(echo "${db}" | xargs)"
  [ -z "${db}" ] && continue
  out_file="${BACKUP_DIR}/${TIMESTAMP}_${db}.sql"
  echo "Backing up database: ${db}"
  docker exec postgres pg_dump -U postgres -d "${db}" --clean --if-exists --create > "${out_file}"
done

ln -sfn "${BACKUP_DIR}" "${BACKUP_BASE}/latest"

find "${BACKUP_BASE}" -mindepth 1 -maxdepth 1 -type d \
  -regextype posix-extended -regex '.*/[0-9]{8}_[0-9]{6}' \
  -mtime +"${RETENTION_DAYS}" -print -exec rm -rf {} +

echo "Backup completed successfully. Files created in: ${BACKUP_DIR}"
