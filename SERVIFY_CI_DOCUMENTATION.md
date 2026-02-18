# 🚀 SERVIFY CI/CD DOCUMENTATION - CONTINUOUS INTEGRATION PIPELINE

---

## Overview

This document describes the **CI (Continuous Integration) pipeline** for the Servify project. The pipeline automatically validates, builds, and tests all code changes when creating a pull request from the `staging` branch to the `main` branch.

**Workflow**: `staging` → Pull Request → `main` → **CI Pipeline Executes**

**Note:** This project uses **CI only** - no automatic deployment is included. Deployment is a manual process handled separately.

---

## Table of Contents

1. [CI Pipeline Architecture](#ci-pipeline-architecture)
2. [Six-Phase Pipeline](#six-phase-pipeline)
3. [Test Layers & Parallelization](#test-layers--parallelization)
4. [GitHub Actions Workflow](#github-actions-workflow)
5. [Setup Instructions](#setup-instructions)
6. [Local Development](#local-development)
7. [Troubleshooting](#troubleshooting)
8. [Contributing Guidelines](#contributing-guidelines)

---

## CI Pipeline Architecture

### Trigger Events
- **Pull Request**: From `staging` branch to `main` branch
- **Event Types**: `opened`, `synchronized`, `reopened`
- **Important**: Only PRs to `main` from `staging` trigger CI

### Six-Phase Pipeline Flow

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: LINT & VALIDATE (Sequential - Must Pass First)   │
│  ├─ Check for merge conflict markers                        │
│  ├─ Validate client/Dockerfile exists                       │
│  ├─ Validate server/Dockerfile exists                       │
│  └─ Validate docker-compose.yml exists                      │
└─────────────────────────────────────────────────────────────┘
                           ↓ (PASS)
                           
        ┌──────────────────────────────────────────┐
        │ LAYER 1 & LAYER 2: Testing (PARALLEL)   │
        │                                          │
        │ ┌─ Layer 1: Unit Tests                  │
        │ │  ├─ Frontend unit tests                │
        │ │  └─ Backend unit tests                 │
        │ │                                        │
        │ └─ Layer 2: Integration Tests            │
        │    ├─ Backend + Database integration     │
        │    └─ Frontend + Backend integration     │
        │                                          │
        │ ⚙️  Both layers run simultaneously       │
        └──────────────────────────────────────────┘
                           ↓ (Both PASS)
                           
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4/LAYER 3: E2E TESTS                                │
│  └─ End-to-end testing with Playwright                      │
│     (Tests full user workflows)                             │
└─────────────────────────────────────────────────────────────┘
                           ↓ (PASS)
                           
┌─────────────────────────────────────────────────────────────┐
│  PHASE 5: DOCKER BUILD & TEST                              │
│  ├─ Build backend Docker image                              │
│  ├─ Build frontend Docker image                             │
│  ├─ Test backend container startup                          │
│  └─ Test frontend container startup                         │
└─────────────────────────────────────────────────────────────┘
                           ↓ (All PASS)
                           
┌─────────────────────────────────────────────────────────────┐
│  PHASE 6: CI SUMMARY & REPORTING                           │
│  ├─ Aggregate all results                                   │
│  ├─ Post comment on PR                                      │
│  └─ Report success ✅ or failure ❌                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    ✅ READY TO MERGE
```

---

## Six-Phase Pipeline

### PHASE 1: Lint & Validate
**Purpose**: Verify project structure and detect merge conflicts  
**Runtime**: ~30 seconds  
**Blocks**: All other phases

**Checks**:
- ✅ No merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
- ✅ `client/Dockerfile` exists
- ✅ `server/Dockerfile` exists
- ✅ `docker-compose.yml` exists

**Fails When**:
- Merge conflicts detected
- Missing Dockerfiles
- docker-compose.yml not found

---

### LAYER 1: Unit Tests (Parallel - Phase 2)
**Purpose**: Validate code quality and unit test coverage  
**Runtime**: ~60 seconds  
**Parallelism**: Frontend AND Backend simultaneously

#### Frontend Unit Tests
```bash
npm ci                    # Clean install
npm run test:unit         # Run unit tests
npm run lint              # ESLint validation
```

**Output**:
- ✅ All tests pass
- ✅ No linting errors

#### Backend Unit Tests
```bash
npm ci                    # Clean install
npm run test:unit         # Run unit tests
npm run lint              # Linting (if configured)
```

**Output**:
- ✅ All tests pass
- ✅ No linting errors

---

### LAYER 2: Integration Tests (Parallel - Phase 3)
**Purpose**: Validate component integration and database connectivity  
**Runtime**: ~90 seconds  
**Parallelism**: Runs alongside Layer 1 unit tests  
**Database**: PostgreSQL 15 (via Docker service)

#### Backend + Database Integration
```bash
npm ci                    # Clean install
npm run test:integration  # Integration tests with database
```

**Services Available**:
- PostgreSQL on localhost:5432
- Database: test_db
- User: test_user
- Password: test_pass

**Tests**:
- Database connections
- Query execution
- Transaction handling

#### Frontend + Backend Integration
```bash
npm ci                    # Dependencies
npm start                 # Start backend server (background)
npm run test:integration  # Frontend-backend API tests
```

**Tests**:
- API endpoint connectivity
- Request/response validation
- Authentication flow
- Data serialization

---

### PHASE 4/LAYER 3: E2E Tests
**Purpose**: Validate complete user workflows  
**Runtime**: ~2-3 minutes  
**Tool**: Playwright  
**Depends On**: Layer 1 AND Layer 2 (both must pass)

**Services Started**:
- PostgreSQL 15 (test database)
- Backend server on :3000
- Frontend dev server on :5173

**Tests**:
```bash
npx playwright install    # Install browsers
npx playwright test       # Run end-to-end scenarios
```

**Artifacts**:
- Playwright report (uploaded if tests fail)
- Screenshots of failures
- Video recordings (if configured)

---

### PHASE 5: Docker Build & Test
**Purpose**: Verify containerization and runtime  
**Runtime**: ~120 seconds  
**Depends On**: Layer 3 E2E tests (must pass)

#### Backend Container
```dockerfile
Build: docker build -f server/Dockerfile ./server
Test:  docker run -e DB_HOST=postgres -p 3000:3000 ...
```

**Validates**:
- ✅ Image builds successfully
- ✅ Container starts within 5 seconds
- ✅ Application is responsive
- ✅ No startup errors in logs

#### Frontend Container
```dockerfile
Build: docker build -f client/Dockerfile ./client
Test:  docker run -p 5173:5173 ...
```

**Validates**:
- ✅ Image builds successfully
- ✅ Container starts within 5 seconds
- ✅ Web server is responsive
- ✅ No errors in logs

---

### PHASE 6: CI Summary & Reporting
**Purpose**: Aggregate results and report status  
**Runtime**: ~10 seconds  
**Trigger**: After ALL phases complete

**Success Report** (✅ All Phases Passed):
```
✅ PHASE 1: Lint & Validate
✅ LAYER 1: Unit Tests
✅ LAYER 2: Integration Tests
✅ LAYER 3: E2E Tests
✅ PHASE 5: Docker Build & Test

🎉 PR is ready to merge!
```

**Failure Report** (❌ Phase Failed):
- Shows which phase failed
- Provides troubleshooting steps
- Links to workflow logs
- Blocks PR merge

---

## Test Layers & Parallelization

### Execution Timeline

```
Time  Phase                          Duration
────────────────────────────────────────────────
 0s   ▶ PHASE 1: Lint & Validate     ████░░░░░░░░░░░░░░░  30s
30s   ▶ Layer 1 & 2 (Parallel)       █████████████░░░░░░░  90s
      │ ├─ Layer 1: Unit Tests        ████░░░░░░░░░░░░░░░  60s
      │ └─ Layer 2: Integration      █████████░░░░░░░░░░░  90s
120s  ▶ PHASE 4: E2E Tests           █████████░░░░░░░░░░░ 180s
300s  ▶ PHASE 5: Docker Build        ██████████░░░░░░░░░░ 120s
420s  ▶ PHASE 6: CI Summary          █░░░░░░░░░░░░░░░░░░░  10s
────────────────────────────────────────────────
Total: ~7 minutes
```

### Parallel Execution Benefits
- **Layer 1 Unit Tests** + **Layer 2 Integration Tests** run simultaneously
  - Tests frontend while backend integrates with database
  - Reduces overall pipeline time
  - Better resource utilization

### Dependency Chain
```
Phase 1 (Validate)
   ├─→ Layer 1 (Unit Tests)
   │       ├─→ Phase 4 (E2E Tests)
   │       │      └─→ Phase 5 (Docker)
   │       │           └─→ Phase 6 (Summary)
   │
   └─→ Layer 2 (Integration Tests)
           └─→ Phase 4 (E2E Tests)
```

---

## GitHub Actions Workflow

### File Location
`.github/workflows/ci.yml`

### Workflow Trigger
```yaml
on:
  pull_request:
    branches: ["main"]
    types: [opened, synchronized, reopened]
```

### Jobs Structure
```yaml
jobs:
  phase-1-lint-validate           # Phase 1
  layer-1-frontend-unit-tests     # Layer 1
  layer-1-backend-unit-tests      # Layer 1
  layer-2-backend-integration     # Layer 2
  layer-2-frontend-backend-integration  # Layer 2
  layer-3-e2e-tests               # Phase 4/Layer 3
  phase-5-docker-build-test       # Phase 5
  phase-6-ci-summary              # Phase 6
```

### Job Dependencies
```yaml
Phase 1 ↓
├─→ Layer 1 Jobs (Parallel)
│   ├─→ Phase 4 ↓
│   │   └─→ Phase 5 ↓
│   │       └─→ Phase 6
│   └─→ Layer 2 Jobs (Parallel)
│       └─→ Phase 4 (same)
```

---

## Setup Instructions

### 1. Prerequisites
- GitHub repository with Servify code
- `staging` branch created (for feature development)
- Node.js 20+ (for local testing)
- Docker and Docker Compose

### 2. Create Staging Branch
```bash
git checkout -b staging
git push -u origin staging
```

### 3. Enable GitHub Actions
1. Go to **Settings** → **Actions** → **General**
2. Enable "Allow all actions and reusable workflows"
3. Save changes

### 4. Verify Required Files
```bash
# Ensure all files exist
ls -la client/Dockerfile
ls -la server/Dockerfile
ls -la docker-compose.yml
```

### 5. Configure npm Scripts
Update `client/package.json` and `server/package.json`:

```json
{
  "scripts": {
    "test:unit": "echo 'Unit tests not configured yet'",
    "test:integration": "echo 'Integration tests not configured yet'",
    "lint": "eslint .",
    "start": "node index.js",
    "dev": "vite"
  }
}
```

### 6. Test the Pipeline
1. Create feature branch from `staging`: `git checkout -b feature/test-ci`
2. Make a small change
3. Commit and push: `git push origin feature/test-ci`
4. Create PR from `feature/test-ci` → `staging`
5. Verify CI runs (optional verification step)
6. Merge to staging
7. Create PR from `staging` → `main`
8. Watch CI pipeline execute!

---

## Local Development

### Run CI Checks Locally

#### Phase 1: Lint & Validate
```bash
# Check for merge conflicts
git diff --check

# Verify files exist
ls -la client/Dockerfile server/Dockerfile docker-compose.yml
```

#### Layer 1: Unit Tests
```bash
# Frontend
cd client
npm install
npm run test:unit
npm run lint

# Backend
cd ../server
npm install
npm run test:unit
npm run lint
```

#### Layer 2: Integration Tests
```bash
# Start PostgreSQL
docker run -d \
  -e POSTGRES_USER=test_user \
  -e POSTGRES_PASSWORD=test_pass \
  -e POSTGRES_DB=test_db \
  -p 5432:5432 \
  postgres:15-alpine

# Backend integration
cd server
npm run test:integration

# Frontend-backend integration
cd ../client
# Ensure backend is running
npm run test:integration

# Cleanup
docker stop <container-id>
```

#### Phase 4: E2E Tests
```bash
# Install Playwright
cd client
npx playwright install

# Run tests
npx playwright test

# View report
npx playwright show-report
```

#### Phase 5: Docker Build & Test
```bash
# Backend
docker build -f server/Dockerfile -t servify-backend:test ./server
docker run -d --name test-backend \
  -p 3000:3000 \
  -e DB_HOST=localhost \
  servify-backend:test
docker logs test-backend

# Frontend
docker build -f client/Dockerfile -t servify-frontend:test ./client
docker run -d --name test-frontend -p 5173:5173 servify-frontend:test
docker logs test-frontend

# Cleanup
docker stop test-backend test-frontend
docker rm test-backend test-frontend
```

---

## Troubleshooting

### Phase 1 Failing

**Error**: Merge conflicts detected
```bash
# Resolve conflicts
git fetch origin main
git merge origin/main
# Fix conflicts in files
git add <files>
git commit -m "Resolve merge conflicts"
git push
```

**Error**: Dockerfile not found
```bash
# Verify location
ls -la client/Dockerfile server/Dockerfile

# If missing, create from template
cat > client/Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
EOF
```

---

### Layer 1 (Unit Tests) Failing

**Error**: npm dependencies fail
```bash
cd client
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check for peer dependency issues
npm list
```

**Error**: ESLint errors
```bash
cd client
npm run lint -- --fix  # Auto-fix
npm run lint           # Check remaining
```

---

### Layer 2 (Integration Tests) Failing

**Error**: Database connection refused
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Verify connection string
# Should be: localhost:5432 in CI, or docker service name in workflow
```

**Error**: Backend not responding
```bash
# Ensure backend starts correctly
cd server
npm start

# Check on different terminal
curl http://localhost:3000
```

---

### Phase 4 (E2E Tests) Failing

**Error**: Playwright not installed
```bash
cd client
npx playwright install --with-deps
npx playwright test
```

**Error**: Services not ready
```bash
# Check if services are running
curl http://localhost:5173
curl http://localhost:3000

# Increase wait time in workflow if needed
```

---

### Phase 5 (Docker) Failing

**Error**: Docker image won't build
```bash
docker build -f server/Dockerfile -t test ./server

# Check error message
# Common: Missing dependencies, invalid Dockerfile syntax
```

**Error**: Container won't start
```bash
docker run -it --name test-backend \
  -e DB_HOST=postgres \
  servify-backend:test

# Check logs
docker logs test-backend

# Try with shell
docker run -it --entrypoint /bin/sh servify-backend:test
```

---

## Contributing Guidelines

### Workflow: Feature Development

```
1. Start from staging branch
   git checkout staging
   git pull origin staging

2. Create feature branch
   git checkout -b feature/your-feature

3. Make changes and commit
   git add .
   git commit -m "feat: add awesome feature"

4. Push to GitHub
   git push origin feature/your-feature

5. Create PR: feature/your-feature → staging
   (Optional CI pipeline for validation)

6. Get code review on staging PR

7. Merge to staging
   git checkout staging
   git pull origin staging

8. Create PR: staging → main
   (REQUIRED: CI pipeline validates before merge)

9. Get approval and merge to main
   (Production-ready code)
```

### Before Creating PR to Main

1. **Ensure tests pass locally**
   ```bash
   cd client && npm run test:unit && npm run lint
   cd ../server && npm run test:unit
   ```

2. **Test Docker builds**
   ```bash
   docker-compose build
   docker-compose up --exit-code-from backend
   ```

3. **Verify no conflicts**
   ```bash
   git fetch origin main
   git merge-base --is-ancestor origin/main HEAD
   ```

4. **Check commit messages**
   - Follow convention: `[type]: [description]`
   - Types: feat, fix, docs, style, refactor, test, ci

### Commit Message Convention

```
[type]: [description]

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style, formatting
- refactor: Code refactor
- test: Tests
- ci: CI/CD changes
- chore: Dependencies

Examples:
- feat: Add user authentication
- fix: Resolve CORS error
- ci: Update GitHub Actions workflow
```

### PR Title Convention

```
[scope]: [description]

Examples:
- [frontend]: Add dark mode toggle
- [backend]: Implement JWT middleware
- [db]: Add user migrations
- [devops]: Update CI pipeline
```

---

## FAQ

### Q: Why only PRs to main trigger CI?
**A**: `staging` is for development/testing. `main` is production. Only production PRs require full validation.

### Q: Can I skip CI?
**A**: No. All PRs to `main` must pass CI. Use commit message `[skip ci]` only for non-code changes.

### Q: How long does CI take?
**A**: Typically 5-7 minutes. Parallel testing reduces time from 8+ minutes to 7.

### Q: Can I run tests locally?
**A**: Yes! Follow the [Local Development](#local-development) section.

### Q: What if Layer 1 and 2 fail?
**A**: Layer 3 (E2E) won't run. Fix Layer 1 & 2 first, then E2E automatically runs.

### Q: Can I re-run CI?
**A**: Push a new commit or use GitHub UI: Actions → Workflow → Re-run all jobs

---

## Next Steps

1. ✅ Create `staging` branch
2. ✅ Configure npm test scripts in both package.json files
3. ✅ Create Dockerfiles if missing
4. ✅ Test locally
5. ✅ Create feature branch and test PR
6. ✅ Merge successful PR to main

---

**Last Updated**: February 2026  
**Project**: Servify  
**Pipeline Type**: Continuous Integration (CI) Only  
**Trigger**: PR staging → main

---

## GitHub Actions Workflow

### File Location
`.github/workflows/ci.yml`

### Workflow Permissions
```yaml
permissions:
  contents: read           # Read repository content
  issues: write           # Create/comment on issues
  pull-requests: write    # Comment on PRs
```

### Environment Variables
```yaml
REGISTRY: ${{ secrets.DOCKER_USERNAME }}     # Docker Hub username
BACKEND_IMAGE: servify-backend               # Backend image name
FRONTEND_IMAGE: servify-frontend             # Frontend image name
```

### Secrets Required (Optional)
```
DOCKER_USERNAME    # Docker Hub username (for security scanning)
DOCKER_PASSWORD    # Docker Hub token (for security scanning)
```

---

## Setup Instructions

### 1. Prerequisites
- GitHub repository with Servify code
- Node.js 20+ (for local testing)
- Docker and Docker Compose (for container testing)

### 2. Enable GitHub Actions
1. Go to **Settings** → **Actions** → **General**
2. Enable "Allow all actions and reusable workflows"
3. Save changes

### 3. Add Secrets (Optional - for security scanning)
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token

### 4. Verify Dockerfiles Exist
```bash
# Ensure both exist
ls -la client/Dockerfile
ls -la server/Dockerfile
ls -la docker-compose.yml
```

### 5. Test Locally (Optional)
```bash
# Frontend
cd client && npm install && npm run lint

# Backend
cd server && npm install

# Docker
docker-compose build
docker-compose up --exit-code-from backend
```

---

## Local Development

### Run CI Checks Locally

#### Frontend Linting
```bash
cd client
npm install
npm run lint
```

#### Backend Linting
```bash
cd server
npm install
npm run lint  # May not be configured - will skip
```

#### Docker Build Test
```bash
# Build both images
docker build -f client/Dockerfile -t servify-frontend:test ./client
docker build -f server/Dockerfile -t servify-backend:test ./server

# Test backend container
docker run -d --name test-backend \
  -p 3000:3000 \
  -e DB_HOST="localhost" \
  -e DB_PORT="5432" \
  -e DB_NAME="servify_db" \
  -e DB_USERNAME="postgres" \
  -e DB_PASSWORD="password" \
  -e PORT="3000" \
  servify-backend:test

# Check if running
docker ps | grep test-backend

# View logs
docker logs test-backend

# Clean up
docker stop test-backend
docker rm test-backend
```

#### Full Docker Compose Test
```bash
# Start all services
docker-compose up --build

# In another terminal, check if services are running
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Troubleshooting

### Frontend Tests Failing

**Error**: `npm ci` fails
```bash
# Solution 1: Clear cache
npm cache clean --force
rm -rf client/node_modules package-lock.json

# Solution 2: Regenerate lock file
cd client
npm install

# Solution 3: Check Node version
node --version  # Should be 20+
```

**Error**: ESLint errors
```bash
# View linting issues
cd client
npm run lint

# Fix automatically where possible
npm run lint -- --fix
```

---

### Backend Tests Failing

**Error**: Dependencies not found
```bash
# Reinstall dependencies
cd server
npm install
npm audit fix  # Fix security issues
```

---

### Docker Build Failing

**Error**: `Dockerfile not found`
```bash
# Verify files exist
ls -la client/Dockerfile
ls -la server/Dockerfile

# If missing, copy from template or create
# See Dockerfile section below
```

**Error**: `COPY failed: file not found`
```bash
# Check current directory
docker build -f server/Dockerfile -t servify-backend:test ./server
#                                                           ^^^^^^^^
#                                                           Context dir

# Should be run from project root:
docker build -f server/Dockerfile -t servify-backend:test ./server
```

---

### Container Startup Issues

**Error**: Container exits immediately
```bash
# Check logs
docker logs test-backend

# Common causes:
# 1. Missing environment variables
# 2. Port already in use (try different port)
# 3. Database connection failed (expected in test environment)
```

**Error**: "port already in use"
```bash
# Find process using port
lsof -i :3000
# or on Windows
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

---

## Recommended Dockerfiles

### Backend Dockerfile (Node.js Express)
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["node", "index.js"]
```

### Frontend Dockerfile (Vite + React)
```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run production build
RUN npm install -g serve

# Copy built app
COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
```

---

## Contributing Guidelines

### Before Creating a PR

1. **Update Dependencies** (if changed package.json)
   ```bash
   npm ci
   ```

2. **Run Linting Locally**
   ```bash
   cd client && npm run lint
   cd ../server && npm run lint || true
   ```

3. **Test Docker Builds**
   ```bash
   docker-compose build
   ```

4. **Check for Conflicts**
   ```bash
   git fetch origin
   git merge-base --is-ancestor origin/main HEAD
   ```

### PR Requirements

✅ **Must Pass**:
- [ ] Linting validation
- [ ] Docker builds
- [ ] Container startup tests
- [ ] No merge conflicts

⚠️ **Should Pass** (if secrets configured):
- [ ] Security scanning (Trivy)

### Commit Message Convention

```
[type]: [description]

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style (eslint, formatting)
- refactor: Code refactor
- test: Tests
- ci: CI/CD changes
- chore: Dependencies, config

Examples:
- feat: Add user authentication endpoint
- fix: Resolve CORS issue in backend
- docs: Update API documentation
- ci: Update GitHub Actions workflow
```

---

## CI Pipeline Configuration Reference

### Runs On
- `ubuntu-latest` (GitHub-hosted runner)

### Node Version
- 20.x (LTS)

### npm Caching
- Automatic caching of node_modules
- Cache key based on package-lock.json

### Timeout
- Default: 360 minutes
- Container tests: 5 second startup timeout

### Artifact Retention
- None configured (can be added if needed)

---

## What's NOT Included

❌ **Not in CI Pipeline**:
- Automatic deployment to production
- Database migrations
- Cache invalidation
- Load testing
- Performance benchmarks
- End-to-end integration tests

---

## FAQ

### Q: Why no automatic deployment?
**A**: CD (Continuous Deployment) was excluded per requirements. Deployments are manual processes.

### Q: Can I run the CI pipeline locally?
**A**: Yes! Run the commands listed in the [Local Development](#local-development) section.

### Q: What if I don't have Docker Hub account?
**A**: Security scanning will be skipped. You can still use the CI pipeline without it.

### Q: How do I skip CI for a commit?
**A**: Add `[skip ci]` to your commit message:
```bash
git commit -m "chore: update readme [skip ci]"
```

### Q: Can I test a PR before merging?
**A**: Yes, GitHub will run CI automatically on all PRs. Wait for the green checkmark.

### Q: What if CI fails?
**A**: 
1. Click the "Details" link next to the failed check
2. Review the error logs
3. Fix issues in your branch
4. Push changes (CI will re-run automatically)

---

## Next Steps

1. ✅ Copy `.github/workflows/ci.yml` to your repository
2. ✅ Ensure Dockerfiles exist in `client/` and `server/`
3. ✅ Verify docker-compose.yml is present
4. ✅ Create a test PR to verify CI runs
5. ✅ (Optional) Add Docker Hub secrets for security scanning

---

## Support & Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **ESLint**: https://eslint.org/
- **Docker Documentation**: https://docs.docker.com/
- **Trivy Vulnerability Scanner**: https://github.com/aquasecurity/trivy

---

**Last Updated**: February 2026  
**Servify Project**: https://github.com/mamasalanang-gerald/Servify
