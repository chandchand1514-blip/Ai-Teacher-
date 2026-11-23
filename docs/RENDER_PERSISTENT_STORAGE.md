# Render Persistent Storage Setup

The server now reads and writes its JSON data files from `DATA_DIR`.

## Render setup (required for persistence)
1. Open the Render Web Service for AI Teacher.
2. Open **Disks** and create/attach a persistent disk.
3. Set its mount path to `/var/data` (choose a size suitable for the stored profiles and histories).
4. In Environment, add `DATA_DIR=/var/data`.
5. Redeploy the service.

All server data files (student memory, admin passcode, app/UI config, complaints, notifications, snapshots, directives, and bot config) are stored under this directory.

## Important
- Existing files in the service's old working directory are not automatically copied to the disk. Before switching, export/backup existing JSON files or copy them to the disk using a one-time migration. Do not delete the old files until verified.
- The persistent disk is attached to Render only. Vercel's serverless filesystem is not persistent; do not use this server's JSON-file storage there as the authoritative database.
- The app does not yet use a managed database (PostgreSQL/SQLite). Persistent disk protects files across Render deploy/restart, but does not provide database transactions or multi-instance coordination.
- Admin API authorization still needs a server-side session/token gate before the admin routes can be considered secure.
