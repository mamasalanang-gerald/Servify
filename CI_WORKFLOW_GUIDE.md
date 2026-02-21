# GitHub Actions Workflow Visual Guide

## CI Pipeline Visualization

### Execution Flow

```
PR Created/Updated
        │
        ▼
┌─────────────────────────────────┐
│   STAGE 1: Lint & Validate      │
│  (Validation only - ~30 sec)    │
└─────────────────────────────────┘
        │
        ├─ ✅ Dockerfiles exist
        ├─ ✅ docker-compose valid
        ├─ ✅ No merge conflicts
        │
        ▼ (PASS → Continue)
        
        ┌──────────────────────────────────────────┐
        │                                          │
        │   STAGE 2: Frontend Tests (Parallel)      │
        │   (~60 sec)                              │
        │   ├─ npm ci                              │
        │   └─ npm run lint                        │
        │                                          │
        │   STAGE 3: Backend Tests (Parallel)       │
        │   (~30 sec)                              │
        │   ├─ npm ci                              │
        │   └─ npm run lint (if configured)        │
        │                                          │
        └──────────────────────────────────────────┘
        │
        ▼ (Both PASS → Continue)
        
┌─────────────────────────────────┐
│  STAGE 4: Docker Build & Test   │
│  (~2 min)                       │
└─────────────────────────────────┘
        │
        ├─ 🔨 Build frontend image
        ├─ 🔨 Build backend image
        ├─ 🧪 Test frontend container
        ├─ 🧪 Test backend container
        │
        ▼ (All PASS → Continue)
        
┌─────────────────────────────────┐
│  STAGE 5: Security Scanning     │
│  (Optional - ~1 min)            │
│  (PR only)                      │
└─────────────────────────────────┘
        │
        ├─ 🔍 Trivy scan backend
        ├─ 🔍 Trivy scan frontend
        │
        ▼ (Complete - Warning OK)
        
┌─────────────────────────────────┐
│  STAGE 6: CI Summary            │
│  (Aggregation - ~10 sec)        │
└─────────────────────────────────┘
        │
        ├─ 📊 Summarize all results
        ├─ 💬 Post comment on PR
        └─ ✅ Mark PR as ready
        
        ▼
┌─────────────────────────────────┐
│  ✅ CI PIPELINE COMPLETE        │
│  Ready for Manual Review        │
│  & Merge Approval               │
└─────────────────────────────────┘
```

---

## Stage Duration Breakdown

```
Total Pipeline Time: ~4-5 minutes (typical)

┌──────────────────────────────────────────┐
│ Stage 1: Lint & Validate       ███░░░░░░ │  30s
│ Stage 2-3: Tests (Parallel)    ███████░░ │  60s
│ Stage 4: Docker Build & Test   ██████░░░ │ 120s
│ Stage 5: Security Scan         ██░░░░░░░ │  60s (PR only)
│ Stage 6: Summary               █░░░░░░░░ │  10s
└──────────────────────────────────────────┘
```

---

## Job Dependencies

```
lint-and-validate (Independent)
        │
        ├───────────┬──────────────┬──────────────────┐
        │           │              │                  │
        ▼           ▼              ▼                  ▼
   frontend-    backend-      docker-build-      security-
   tests        tests         test                scan
   (parallel)   (parallel)
        │           │              │                  │
        └───────────┴──────────────┴──────────────────┘
                     │
                     ▼
              ci-summary
              (final stage)
```

---

## Status Indicators in GitHub UI

### PR Check Status Examples

#### ✅ All Checks Passed
```
✅ lint-and-validate         All checks passed
✅ frontend-tests
✅ backend-tests
✅ docker-build-test
✅ security-scan
✅ ci-summary
```

#### ❌ One Check Failed
```
✅ lint-and-validate         
✅ frontend-tests
❌ backend-tests             Build failed - npm dependency issue
⏸  docker-build-test        Waiting (skipped due to failed dependency)
⏸  security-scan
⏸  ci-summary
```

#### 🔄 In Progress
```
✅ lint-and-validate         Completed
🔄 frontend-tests            Running...
⏳ backend-tests             Waiting
⏳ docker-build-test         Waiting
⏳ security-scan             Waiting
⏳ ci-summary                Waiting
```

---

## Common Status Codes

| Icon | Meaning | Action |
|------|---------|--------|
| ✅ | Passed | OK to merge (with approval) |
| ❌ | Failed | Must fix before merge |
| 🔄 | Running | Wait for completion |
| ⏳ | Pending | Queued or waiting for dependency |
| ⏸ | Skipped | Disabled or dependency failed |
| 🚫 | Cancelled | Manual cancellation |

---

## PR Comment Example

### When All Checks Pass

```
✅ All CI checks passed!

📋 Summary:
  ✅ Linting and validation - Passed
  ✅ Frontend tests (linting) - Passed
  ✅ Backend tests (linting) - Passed
  ✅ Docker image builds - Passed
  ✅ Container startup tests - Passed
  ✅ Security scanning - Passed

🎉 This PR is ready to be merged!
```

### When Checks Fail

```
## ❌ CI Pipeline Failed

Build Details:
- PR: #42
- Branch: `feature/new-auth`
- Run: [12345678](link to logs)

### Failed Jobs:

❌ **Backend Tests** - Run `cd server && npm install` locally

### Action Required:

1. Review the full logs by clicking the workflow run link
2. Identify the root cause from the error messages
3. Fix the issues in your feature branch
4. Push fixes to update the PR
5. CI will automatically re-run on new commits

### Troubleshooting:

**Backend Tests Failed?**
- `cd server && npm install`

**Docker Build Failed?**
- Verify Dockerfiles exist and are valid
- Check package.json for missing dependencies
```

---

## Webhook Triggers

### On Pull Request
```
Event: PR opened, synchronized, or reopened
Branches: main, develop
Actions: Run full CI pipeline
```

### On Push to Main
```
Event: Push to main branch
Actions: Run full CI pipeline
Purpose: Verify main branch integrity
```

### Manual Trigger (Optional)
```
Can be enabled for debugging:
Settings → Actions → Allow workflow_dispatch

Use: Manually trigger from GitHub UI
```

---

## Environment Variables in Workflow

```yaml
REGISTRY: ${{ secrets.DOCKER_USERNAME }}
# Used for Docker Hub operations (optional)

BACKEND_IMAGE: servify-backend
# Docker image name for backend

FRONTEND_IMAGE: servify-frontend
# Docker image name for frontend
```

---

## Secrets Configuration

### Optional (for security scanning)

```bash
# In GitHub UI:
# Settings → Secrets and variables → Actions → New repository secret

DOCKER_USERNAME    # Docker Hub username
DOCKER_PASSWORD    # Docker Hub personal access token
```

### How to Get Docker Hub Token

1. Visit https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Give it a name (e.g., "GitHub Actions")
4. Set permissions to read-only
5. Copy token to GitHub secret

---

## Cache Strategy

### Node Modules Caching
```yaml
Cache Key: node-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

**Benefits**:
- 🚀 Faster installs (cached modules)
- 💰 Reduced bandwidth
- ⚡ Shorter pipeline execution

**When cache invalidates**:
- package-lock.json changes
- New dependencies added
- Manual cache clear

---

## Access Logs

### In GitHub UI

1. Go to **Actions** tab
2. Select workflow run from list
3. Click job name to expand
4. Click step to view logs

### In Command Line
```bash
# Clone repository
git clone <repo>
cd Servify

# View recent workflow runs
gh run list

# View specific run details
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

---

## Artifacts (If Configured)

Current setup does NOT generate artifacts, but can be added:

### Examples
```yaml
- Security scan reports
- Coverage reports
- Build logs
- Docker image digests
```

### How to Add
```yaml
- name: Upload artifact
  uses: actions/upload-artifact@v4
  with:
    name: test-report
    path: reports/
    retention-days: 30
```

---

## Cost Considerations

### GitHub Actions Pricing

- **Public repositories**: FREE unlimited minutes
- **Private repositories**: 2,000 free minutes/month per account
- **Typical Servify CI cost**: ~4-5 minutes per PR

### Cost Optimization
- ✅ Parallel jobs (tests run simultaneously)
- ✅ Caching node_modules (faster builds)
- ✅ Minimal security scanning (Trivy only)

---

## Performance Tips

### For Faster Execution

1. **Use npm ci instead of npm install**
   - Faster and deterministic
   - Already in workflow ✅

2. **Enable caching**
   - Caches node_modules automatically ✅

3. **Run tests in parallel**
   - Frontend and backend tests run together ✅

4. **Limit security scanning to PRs**
   - Only runs on pull requests ✅

---

## Troubleshooting Checklist

- [ ] Workflow file exists at `.github/workflows/ci.yml`
- [ ] Dockerfiles exist at `client/Dockerfile` and `server/Dockerfile`
- [ ] docker-compose.yml is valid YAML
- [ ] package-lock.json files are present
- [ ] npm dependencies are listed correctly
- [ ] No syntax errors in Node.js code
- [ ] Docker daemon is running (for manual testing)
- [ ] GitHub Actions is enabled in repository settings

---

## Related Documentation

📄 **SERVIFY_CI_DOCUMENTATION.md** - Complete CI guide with setup instructions  
📄 **CI_SETUP_SUMMARY.md** - Summary of changes and next steps  
📄 **TECH_STACK.md** - Project architecture and dependencies

---

## Quick Links

- 🔗 GitHub Actions Docs: https://docs.github.com/en/actions
- 🔗 Workflow Syntax: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- 🔗 ESLint: https://eslint.org/
- 🔗 Docker: https://docs.docker.com/
- 🔗 Trivy: https://github.com/aquasecurity/trivy

---

**Last Updated**: February 2026  
**Project**: Servify  
**Pipeline Type**: CI Only (No CD)
