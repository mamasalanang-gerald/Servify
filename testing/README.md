# Servify API Testing Automation

This folder contains an isolated Postman + Newman automation setup for the Servify API.

## Contents

- `postman/Servify.API.postman_collection.json`
  - Import-ready Postman collection with assertions and variable capture.
- `postman/local.postman_environment.json`
  - Local environment template (`baseUrl`, `admin/provider/client` credentials).
- `scripts/generate-postman-collection.js`
  - Source generator for the collection JSON.
- `scripts/run-newman.js`
  - Newman runner with folder selection and report output.
- `reports/`
  - Generated HTML/JUnit reports.

## Prerequisites

1. API is running (default from your compose file: `http://localhost:3000`).
2. Database is up and migrated.
3. You have working credentials for:
   - `adminEmail` / `adminPassword`
   - `providerEmail` / `providerPassword`
   - `clientEmail` / `clientPassword`

## Setup

```bash
cd testing
npm install
npm run generate:collection
```

## Configure Environment

Edit `testing/postman/local.postman_environment.json` with your real login credentials.

## Run Tests

From `testing/`:

```bash
npm run test:smoke
npm run test:e2e
npm run test:negative
npm run test:all
```

## Token/Role Handling

- The suite logs in provider/client directly using provided credentials.
- After `PATCH /users/promote`, it automatically runs `POST /auth/refresh`.
- The refreshed access token is decoded in-script and must contain `role: "provider"`.
- The refreshed token is then used for all provider-only endpoints.

This enforces role-sync behavior for token revocation/reissue flows after promotion.

## Data Integrity Checks

- The flow captures and validates live data through API snapshots:
  - users: `GET /api/v1/users/` (admin)
  - categories: `GET /api/v1/categories/`
  - services: `GET /api/v1/services/`
  - bookings: `GET /api/v1/bookings/client/:clientId`
- Snapshot steps auto-resolve IDs (`categoryId`, `serviceId`, `bookingId`) before dependent create/update calls.
- Response parsing is tolerant to both wrapped and raw payload styles to avoid false failures from response-shape differences.

## Notes

- Reports are written to `testing/reports/` as `.html` and `.xml`.
- If you modify coverage, update `scripts/generate-postman-collection.js`, then regenerate the collection.
