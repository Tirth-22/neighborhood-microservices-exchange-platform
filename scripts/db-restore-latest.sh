#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="${1:-./backups}"
BACKUP_TIMESTAMP="${2:-}"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_BASE="${PROJECT_ROOT}/${BACKUP_ROOT}"

if ! docker ps --format '{{.Names}}' | grep -q '^postgres$'; then
  echo "Postgres container 'postgres' is not running. Start stack first: docker-compose up -d" >&2
  exit 1
fi

if [ ! -d "${BACKUP_BASE}" ]; then
  echo "Backup root not found: ${BACKUP_BASE}" >&2
  exit 1
fi

if [ -z "${BACKUP_TIMESTAMP}" ]; then
  BACKUP_PATH="$(find "${BACKUP_BASE}" -mindepth 1 -maxdepth 1 -type d | grep -E '.*/[0-9]{8}_[0-9]{6}$' | sort -r | head -n1)"
  if [ -z "${BACKUP_PATH}" ]; then
    echo "No timestamped backup directories found in ${BACKUP_BASE}" >&2
    exit 1
  fi
else
  BACKUP_PATH="${BACKUP_BASE}/${BACKUP_TIMESTAMP}"
  if [ ! -d "${BACKUP_PATH}" ]; then
    echo "Backup timestamp directory not found: ${BACKUP_PATH}" >&2
    exit 1
  fi
fi

echo "Restoring from: ${BACKUP_PATH}"

shopt -s nullglob
DUMPS=("${BACKUP_PATH}"/*.sql)
shopt -u nullglob

if [ "${#DUMPS[@]}" -eq 0 ]; then
  echo "No SQL dump files found in ${BACKUP_PATH}" >&2
  exit 1
fi

for dump in "${DUMPS[@]}"; do
  echo "Restoring dump: $(basename "${dump}")"
  docker exec -i postgres psql -U postgres -d postgres < "${dump}"
done

echo "Restore completed successfully from: ${BACKUP_PATH}"
