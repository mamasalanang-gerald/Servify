# Servify Test Automation

This package now runs both API automation (Postman/Newman) and frontend automation (Playwright).

## What happens before every run

`scripts/bootstrap-test-users.js` executes first (unless `--skip-bootstrap` is explicitly used):

1. Runs `server/scripts/seedAdmin.js` to ensure admin exists.
2. Creates 2 users as clients:
   - provider candidate: `qa.provider@servify.com`
   - client: `qa.client@servify.com`
3. Promotes the provider candidate through API `PATCH /api/v1/users/promote`.
4. Ensures the other test user remains `client`.
5. Rewrites Postman env files with current credentials.

Admin credentials used:
- `admin@servify.com`
- `Admin@123456`

## Prerequisites

1. Backend API running at `http://localhost:3000`.
2. Frontend running at `http://localhost:5173` (for UI tests).
3. PostgreSQL reachable by backend.

Optional overrides:
- `TEST_BASE_URL` (default `http://localhost:3000`)
- `TEST_FRONTEND_URL` (default `http://localhost:5173`)
- `TEST_PROVIDER_EMAIL`, `TEST_PROVIDER_PASSWORD`
- `TEST_CLIENT_EMAIL`, `TEST_CLIENT_PASSWORD`

## Setup

```bash
cd testing
npm install
npm run generate:collection
npx playwright install
```

## Commands

API:
- `npm run test:api:smoke`
- `npm run test:api:e2e`
- `npm run test:api:negative`
- `npm run test:api:all`

Frontend:
- `npm run test:ui:smoke`
- `npm run test:ui:e2e`

Combined:
- `npm run test:smoke`
- `npm run test:e2e`
- `npm run test:all`

Custom flow runner:
- `npm run test:custom -- --type api --flow provider-multi-packages`
- `npm run test:custom:provider-multi-packages`
- `npm run test:custom:provider-multi-packages:keep` (keeps created records)

## Frontend coverage

- Smoke: admin and provider login/dashboard access.
- E2E: admin adds category in Admin UI, provider creates service in Provider UI using that category.

## Custom flow parameterization

Pass a JSON file to override defaults (emails, prefixes, package list):

```bash
npm run test:custom -- --type api --flow provider-multi-packages --data custom-flows/data/provider-multi-packages.sample.json
```

Or keep created rows without data file:

```bash
npm run test:custom -- --type api --flow provider-multi-packages --keep-data
```

Flow implemented:
- `provider-multi-packages`: verifies provider-created service supports multiple packages and persists in:
  - `POST /api/v1/services/create`
  - `GET /api/v1/services/:id`
  - `GET /api/v1/services/mine`

## Reports

- Newman reports: `testing/reports/*.html` and `testing/reports/*.xml`
- Playwright reports: `testing/reports/playwright-html/` and `testing/reports/playwright-junit.xml`
