# 🚀 COMPLETE DEVOPS DOCUMENTATION - PART 1: OVERVIEW & ARCHITECTURE

**Last Updated:** February 8, 2026  
**Project:** Pomodify (Angular 20 + Spring Boot 3.5.6)  
**Infrastructure:** AWS EC2 + RDS PostgreSQL  
**CI/CD Platform:** GitHub Actions  

---

## TABLE OF CONTENTS

This documentation is split into 5 parts:
1. **PART 1** - Overview & Architecture (this file)
2. **PART 2** - CI/CD Pipeline & Docker Setup
3. **PART 3** - Database, Deployment & Configuration
4. **PART 4** - Security, Testing & Monitoring
5. **PART 5** - Complete Code References & Troubleshooting

---

## PROJECT STRUCTURE

```
pomodify/
├── pomodify-backend/
│   ├── src/main/java/com/pomodify/backend/
│   │   ├── presentation/controller/     # REST endpoints
│   │   ├── application/service/         # Business logic
│   │   ├── domain/model/                # Domain entities
│   │   └── infrastructure/              # DB, email, security
│   ├── src/test/java/
│   │   ├── **/*Test.java                # Unit tests
│   │   └── integration/                 # Integration tests
│   ├── src/main/resources/
│   │   ├── application.properties       # Main config
│   │   ├── application-dev.properties   # Dev profile
│   │   ├── application-test.properties  # Test profile
│   │   └── db/migration/                # Flyway migrations
│   ├── pom.xml                          # Maven dependencies
│   ├── Dockerfile                       # Multi-stage build
│   ├── .env                             # Environment variables
│   ├── .env.example                     # Template
│   ├── .dockerignore                    # Docker exclusions
│   └── mvnw / mvnw.cmd                  # Maven wrapper
│
├── pomodify-frontend/
│   ├── src/app/
│   │   ├── core/                        # Services, guards, interceptors
│   │   ├── pages/                       # Page components
│   │   ├── shared/                      # Shared components
│   │   └── app.routes.ts                # Routing
│   ├── e2e/
│   │   ├── pages/                       # Page Object Models
│   │   ├── tests/                       # Test specs
│   │   └── fixtures/                    # Test data
│   ├── src/**/*.spec.ts                 # Unit tests
│   ├── package.json                     # npm dependencies
│   ├── Dockerfile                       # Multi-stage build
│   ├── nginx.conf                       # Nginx config
│   ├── playwright.config.ts             # E2E config
│   ├── .dockerignore                    # Docker exclusions
│   └── angular.json                     # Angular config
│
├── .github/workflows/
│   ├── ci.yml                           # PR validation pipeline
│   └── deploy.yml                       # Production deployment
│
├── deploy-documentation/                # DevOps guides
│   ├── START_HERE.md
│   ├── CI_CD_EXECUTIVE_SUMMARY.md
│   ├── CI_CD_PIPELINE_PLAN.md
│   ├── LAYER_1_UNIT_TESTS.md
│   ├── LAYER_2_INTEGRATION_TESTS.md
│   ├── LAYER_3_E2E_TESTS.md
│   ├── IMPLEMENTATION_CHECKLIST.md
│   └── QUICK_REFERENCE_VISUAL.md
│
└── README.md                            # Project overview
```

---

## TECHNOLOGY STACK

### Backend
- **Language:** Java 21
- **Framework:** Spring Boot 3.5.6
- **Build Tool:** Maven 3.9.4
- **Database:** PostgreSQL 15 (RDS)
- **ORM:** Spring Data JPA + Hibernate
- **Migrations:** Flyway 11.7.2
- **Security:** Spring Security + JWT (jjwt 0.12.6)
- **OAuth2:** Google OAuth2 integration
- **Testing:** JUnit 5, Mockito, Testcontainers 1.19.6
- **Property-Based Testing:** jqwik 1.9.2
- **Email:** Spring Mail + SMTP
- **Push Notifications:** Firebase Admin SDK 9.2.0
- **API Docs:** SpringDoc OpenAPI 2.8.5

### Frontend
- **Language:** TypeScript 5.9
- **Framework:** Angular 20.3
- **Build Tool:** npm / Angular CLI 20.3.8
- **Package Manager:** npm
- **Testing:** Jasmine 5.9.0, Karma 6.4.0
- **E2E Testing:** Playwright 1.40.0
- **Property-Based Testing:** fast-check 4.5.3
- **UI Framework:** Angular Material 20.2.14
- **HTTP Client:** Angular HttpClient
- **State Management:** RxJS 7.8.0
- **Firebase:** Firebase 9.22.2 (FCM push notifications)

### DevOps & Infrastructure
- **Container:** Docker (multi-stage builds)
- **Container Registry:** Docker Hub
- **Orchestration:** Docker Compose (local), Docker (production)
- **CI/CD:** GitHub Actions
- **Cloud:** AWS (EC2, RDS, S3)
- **Reverse Proxy:** Nginx (Alpine)
- **Security Scanning:** Trivy, Syft, Cosign
- **Monitoring:** Spring Boot Actuator

---

## DEPLOYMENT ARCHITECTURE

### Production Environment
```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Account                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         EC2 Instance (Ubuntu 22.04)                 │  │
│  │  - Docker Engine                                    │  │
│  │  - Docker Compose                                   │  │
│  │  - Nginx (reverse proxy)                            │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Docker Network: pomodify-net                 │ │  │
│  │  │                                                │ │  │
│  │  │  ┌──────────────────┐  ┌──────────────────┐  │ │  │
│  │  │  │ Frontend         │  │ Backend          │  │ │  │
│  │  │  │ Container        │  │ Container        │  │ │  │
│  │  │  │ (Nginx)          │  │ (Spring Boot)    │  │ │  │
│  │  │  │ Port: 8080       │  │ Port: 8081       │  │ │  │
│  │  │  │ Image: latest    │  │ Image: latest    │  │ │  │
│  │  │  └──────────────────┘  └──────────────────┘  │ │  │
│  │  │                                                │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  RDS PostgreSQL 15                                  │  │
│  │  - Multi-AZ deployment                              │  │
│  │  - Automated backups                                │  │
│  │  - Database: pomodifydb                             │  │
│  │  - User: pomodify_user                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Network Flow
```
User Browser
    ↓
Internet
    ↓
AWS Security Group (Port 80, 443)
    ↓
EC2 Instance (Public IP)
    ↓
Nginx (Port 80)
    ├─→ Static files (Angular) → Port 8080
    └─→ /api/* → Backend (Port 8081)
    ↓
Spring Boot Application
    ↓
RDS PostgreSQL (Private subnet)
```

---

## KEY COMPONENTS

### 1. GitHub Actions Workflows

#### CI Workflow (Pull Requests)
- **File:** `.github/workflows/ci.yml`
- **Trigger:** Pull request to main
- **Duration:** 8-10 minutes
- **Stages:** Lint → Unit Tests → Integration Tests → E2E Tests → Build → Security → Summary

#### Deploy Workflow (Production)
- **File:** `.github/workflows/deploy.yml`
- **Trigger:** Push to main (after CI passes)
- **Duration:** 15-20 minutes
- **Stages:** Build → Push → Sign → Deploy → Verify

### 2. Docker Images

#### Backend Image
- **Base:** eclipse-temurin:21-jre (Alpine)
- **Size:** ~400MB
- **Build Time:** 2-3 minutes
- **Startup Time:** 30-60 seconds
- **Health Check:** Spring Boot Actuator (/actuator/health)

#### Frontend Image
- **Base:** nginx:alpine
- **Size:** ~50MB
- **Build Time:** 1-2 minutes
- **Startup Time:** 2-5 seconds
- **Health Check:** HTTP 200 on /

### 3. Database

#### PostgreSQL 15 (RDS)
- **Version:** 15.x
- **Instance Type:** db.t3.micro (production)
- **Storage:** 20GB (auto-scaling)
- **Backup:** Daily automated backups
- **Multi-AZ:** Yes (high availability)
- **Migrations:** Flyway (automatic on startup)

#### Database Schema
```
Tables:
- app_user (users)
- activity (user activities)
- pomodoro_session (timer sessions)
- user_settings (user preferences)
- user_badge (achievements)
- password_reset_token (password recovery)
```

### 4. Environment Configuration

#### Environment Variables (Backend)
```
# Database
DB_URL=jdbc:postgresql://host:5432/dbname
DB_USERNAME=user
DB_PASSWORD=password
DDL_AUTO=update

# JWT
JWT_SECRET=<256-bit-key>
JWT_ACCESS_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=2592000000

# OAuth2
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>

# Email
SMTP_USERNAME=<email>
SMTP_PASSWORD=<password>

# Firebase
FCM_SERVICE_ACCOUNT=/app/firebase-key.json

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<password>
```

#### Environment Variables (Frontend)
```
# API Configuration
API_BASE_URL=http://localhost:8081
FIREBASE_CONFIG=<firebase-config>
```

---

## DEPLOYMENT FLOW

### Pull Request Flow
```
1. Developer creates PR
   ↓
2. GitHub Actions triggers CI workflow
   ├─ Lint & Validate
   ├─ Unit Tests (Frontend + Backend)
   ├─ Integration Tests (Backend)
   ├─ E2E Tests (Frontend)
   ├─ Docker Build & Test
   ├─ Security Scanning
   └─ CI Summary
   ↓
3. If all pass:
   ├─ PR shows "All checks passed"
   ├─ Can be merged to main
   └─ Deploy workflow triggers automatically
   ↓
4. If any fail:
   ├─ PR shows "Some checks failed"
   ├─ GitHub creates issue with details
   ├─ Cannot merge until fixed
   └─ Developer fixes and pushes again
```

### Production Deployment Flow
```
1. PR merged to main
   ↓
2. Deploy workflow triggers
   ├─ Build frontend image
   ├─ Build backend image
   ├─ Push to Docker Hub
   ├─ Sign images with Cosign
   └─ SSH into EC2
   ↓
3. On EC2:
   ├─ Pull latest images
   ├─ Stop old containers
   ├─ Start new containers
   ├─ Run Flyway migrations
   ├─ Health checks
   └─ Verify deployment
   ↓
4. Services running:
   ├─ Frontend: http://domain:8080
   ├─ Backend: http://domain:8081
   └─ Database: RDS PostgreSQL
```

---

## SECURITY MEASURES

### Image Security
- **Signing:** Cosign signs all production images
- **Verification:** Images verified before deployment
- **SBOM:** Software Bill of Materials generated (Syft)
- **Scanning:** Trivy scans for vulnerabilities (CRITICAL/HIGH)

### Network Security
- **AWS Security Groups:** Restrict inbound traffic
- **SSH Keys:** EC2 access via SSH key only
- **Secrets:** GitHub Secrets for sensitive data
- **HTTPS:** Nginx configured for SSL/TLS (optional)

### Application Security
- **JWT:** Secure token-based authentication
- **OAuth2:** Google OAuth2 integration
- **Password Reset:** Secure token-based reset
- **CORS:** Configured for frontend domain only
- **SQL Injection:** Protected via JPA parameterized queries
- **XSS:** Angular built-in XSS protection

---

## MONITORING & HEALTH CHECKS

### Backend Health Checks
- **Endpoint:** `GET /actuator/health`
- **Response:** `{"status":"UP"}`
- **Frequency:** Every 30 seconds (Docker)
- **Timeout:** 10 seconds
- **Retries:** 3 attempts

### Frontend Health Checks
- **Endpoint:** `GET /`
- **Response:** HTTP 200 with index.html
- **Frequency:** Every 30 seconds (Docker)
- **Timeout:** 10 seconds
- **Retries:** 3 attempts

### Logs
- **Backend:** Spring Boot logs to stdout (Docker captures)
- **Frontend:** Nginx access/error logs
- **Database:** RDS CloudWatch logs
- **CI/CD:** GitHub Actions logs (7 days retention)

---

## QUICK START COMMANDS

### Local Development
```bash
# Backend
cd pomodify-backend
mvn spring-boot:run

# Frontend
cd pomodify-frontend
npm install
npm start

# Docker Compose (full stack)
docker-compose up
```

### Testing
```bash
# Backend unit tests
mvn test

# Backend integration tests
mvn verify

# Frontend unit tests
npm test

# Frontend E2E tests
npm run e2e
```

### Deployment
```bash
# Build images
docker build -f pomodify-backend/Dockerfile -t pomodify-backend:latest ./pomodify-backend
docker build -f pomodify-frontend/Dockerfile -t pomodify-frontend:latest ./pomodify-frontend

# Push to registry
docker push pomodify-backend:latest
docker push pomodify-frontend:latest

# Deploy (automatic via GitHub Actions)
# Just merge PR to main
```

---

## NEXT STEPS

1. **Read PART 2** - CI/CD Pipeline & Docker Setup
2. **Read PART 3** - Database, Deployment & Configuration
3. **Read PART 4** - Security, Testing & Monitoring
4. **Read PART 5** - Complete Code References & Troubleshooting

Each part contains detailed code examples and configurations.

---

**Continue to PART 2 for detailed CI/CD pipeline configuration...**
