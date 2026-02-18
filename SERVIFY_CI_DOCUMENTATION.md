# 🚀 SERVIFY CI/CD DOCUMENTATION - CONTINUOUS INTEGRATION ONLY

---

## Overview

This document describes the **CI (Continuous Integration) pipeline only** for the Servify project. The pipeline automatically validates, builds, and tests all code changes on pull requests and main branch pushes.

**Note:** This project uses **CI only** - no automatic deployment is included. Deployment is a manual process handled separately.

---

## Table of Contents

1. [CI Pipeline Architecture](#ci-pipeline-architecture)
2. [Pipeline Stages](#pipeline-stages)
3. [GitHub Actions Workflow](#github-actions-workflow)
4. [Setup Instructions](#setup-instructions)
5. [Local Development](#local-development)
6. [Troubleshooting](#troubleshooting)
7. [Contributing Guidelines](#contributing-guidelines)

---

## CI Pipeline Architecture

### Trigger Events
- **Pull Requests**: On `main` or `develop` branches (opened, synchronized, reopened)
- **Push to Main**: Automatic validation on main branch pushes
- **Event Types**: `opened`, `synchronize`, `reopened`, `push`

### Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  STAGE 1: Lint & Validate                                       │
│  ├─ Validate Dockerfiles exist                                 │
│  ├─ Validate docker-compose.yml                                │
│  └─ Check for merge conflicts                                  │
│                                                                 │
├─ ✅ PASS → Proceed to Parallel Tests                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STAGE 2: Frontend Tests (Parallel)                             │
│  ├─ Install dependencies (npm ci)                              │
│  └─ Run ESLint                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STAGE 3: Backend Tests (Parallel)                              │
│  ├─ Install dependencies (npm ci)                              │
│  └─ Check for syntax errors                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STAGE 4: Docker Build & Test                                   │
│  ├─ Build backend Docker image                                 │
│  ├─ Build frontend Docker image                                │
│  ├─ Test backend container startup                             │
│  └─ Test frontend container startup                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STAGE 5: Security Scanning (Optional)                          │
│  ├─ Build and push images to registry                          │
│  └─ Run Trivy vulnerability scan                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STAGE 6: CI Summary                                            │
│  ├─ Aggregate all results                                      │
│  ├─ Post comment on PR                                         │
│  └─ Report success/failure                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pipeline Stages

### Stage 1: Lint & Validate
**Purpose**: Verify project structure and basic validation

**Checks**:
- ✅ Frontend Dockerfile exists at `client/Dockerfile`
- ✅ Backend Dockerfile exists at `server/Dockerfile`
- ✅ docker-compose.yml exists and is valid
- ✅ No merge conflicts in branch

**Fails When**:
- Missing Dockerfiles
- Merge conflicts detected
- Invalid YAML syntax

---

### Stage 2: Frontend Tests
**Purpose**: Validate React application quality

**Environment**:
- Node.js 20.x
- npm dependencies cached

**Commands**:
```bash
npm ci                    # Clean install (ensures reproducibility)
npm run lint              # ESLint validation
```

**Output**:
- ✅ No ESLint errors or warnings
- Cached node_modules for faster builds

**Fails When**:
- ESLint errors detected
- Dependencies cannot be resolved

---

### Stage 3: Backend Tests
**Purpose**: Validate Express.js API code

**Environment**:
- Node.js 20.x
- npm dependencies cached

**Commands**:
```bash
npm ci                    # Clean install
npm run lint              # Linting (if configured)
```

**Output**:
- ✅ No linting errors
- ✅ Dependencies valid

**Fails When**:
- Dependencies cannot be resolved
- Syntax errors present

---

### Stage 4: Docker Build & Test
**Purpose**: Verify containerization and runtime

**Backend Container Tests**:
- Build image from `server/Dockerfile`
- Start container with test environment variables
- Verify container stays running
- Check logs for startup errors

**Frontend Container Tests**:
- Build image from `client/Dockerfile`
- Start container on port 5173
- Verify container stays running
- Check logs for startup errors

**Environment Variables (Backend)**:
```
DB_HOST=postgres
DB_PORT=5432
DB_NAME=test_db
DB_USERNAME=test_user
DB_PASSWORD=test_pass
PORT=3000
```

**Fails When**:
- Docker build fails
- Container doesn't start within 5 seconds
- Container exits immediately

---

### Stage 5: Security Scanning (Optional)
**Purpose**: Identify vulnerable dependencies

**Tools**:
- **Trivy**: Container image vulnerability scanner

**Severity Levels Reported**:
- CRITICAL 🔴
- HIGH 🟠

**Output**:
- Vulnerability report
- CVE details
- Remediation suggestions

**Note**: Security scanning runs only on PRs and requires Docker Hub credentials

---

### Stage 6: CI Summary
**Purpose**: Aggregate results and report status

**Output**:
- ✅ Summary comment on PR
- ✅ Pass/Fail status
- ❌ Error report with troubleshooting links
- 📊 Per-stage status

**Actions**:
- Comments CI result on pull request
- Blocks merge if any stage fails
- Provides error report for debugging

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
