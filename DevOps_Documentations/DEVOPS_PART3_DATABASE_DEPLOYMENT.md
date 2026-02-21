# 🚀 COMPLETE DEVOPS DOCUMENTATION - PART 3: DATABASE, DEPLOYMENT & CONFIGURATION

---

## DATABASE SETUP & MIGRATIONS

### PostgreSQL Configuration

#### RDS Instance Setup
```
Instance Type: db.t3.micro (production)
Engine: PostgreSQL 15.x
Storage: 20GB (auto-scaling enabled)
Multi-AZ: Yes (high availability)
Backup Retention: 7 days
Backup Window: 03:00-04:00 UTC
Maintenance Window: sun:04:00-sun:05:00 UTC
```

#### Connection Details
```
Host: pomodifydb.cvwkscysw9h2.ap-southeast-2.rds.amazonaws.com
Port: 5432
Database: pomodifydb
Username: pomodify_user
Password: (stored in GitHub Secrets)
SSL Mode: require
```

### Flyway Database Migrations

#### Migration Files Location
```
pomodify-backend/src/main/resources/db/migration/
├── V1__initial_schema.sql
├── V2__add_user_push_token_enabled.sql
├── V3__create_user_settings_table.sql
├── V4__create_user_badge_table.sql
├── V5__add_timer_sync_fields.sql
├── V6__remove_tick_sound.sql
├── V7__remove_google_calendar_sync_column.sql
├── V8__add_auth_provider_to_app_user.sql
├── V10__add_remaining_seconds_at_pause.sql
├── V12__add_backup_email_to_app_user.sql
├── V13__add_color_to_activity.sql
├── V17__create_password_reset_token_table.sql
└── V18__fix_password_reset_token_timezone.sql
```

#### Flyway Configuration (pom.xml)
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
    <version>11.7.2</version>
</dependency>
```

#### Flyway Properties (application.properties)
```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=false
spring.flyway.out-of-order=false
spring.flyway.validate-on-migrate=true
```

#### Migration Execution
```bash
# Automatic on Spring Boot startup
# Flyway runs all pending migrations in order

# Manual execution (if needed)
mvn flyway:migrate

# Check migration status
mvn flyway:info

# Validate migrations
mvn flyway:validate
```

### Database Schema

#### Core Tables
```sql
-- Users
CREATE TABLE app_user (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_picture_url VARCHAR(500),
    auth_provider VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities
CREATE TABLE activity (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pomodoro Sessions
CREATE TABLE pomodoro_session (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id),
    activity_id UUID REFERENCES activity(id),
    status VARCHAR(50),
    duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Settings
CREATE TABLE user_settings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES app_user(id),
    work_duration INTEGER DEFAULT 25,
    break_duration INTEGER DEFAULT 5,
    long_break_duration INTEGER DEFAULT 15,
    sessions_until_long_break INTEGER DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Badges
CREATE TABLE user_badge (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id),
    badge_name VARCHAR(100),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password Reset Tokens
CREATE TABLE password_reset_token (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## DEPLOYMENT PROCESS

### GitHub Actions Deploy Workflow (.github/workflows/deploy.yml)

**Full Configuration:**

```yaml
name: Deploy to Production

on:
  push:
    branches: ["main"]

env:
  FRONTEND_IMAGE: ${{ secrets.DOCKER_USERNAME }}/pomodify-frontend
  BACKEND_IMAGE: ${{ secrets.DOCKER_USERNAME }}/pomodify-backend
  TAG_LATEST: latest
  TAG_SHA: ${{ github.sha }}

jobs:
  build-and-push:
    name: Build and Push Production Images
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push frontend image
        run: |
          docker build -f pomodify-frontend/Dockerfile \
            -t $FRONTEND_IMAGE:$TAG_LATEST \
            -t $FRONTEND_IMAGE:$TAG_SHA \
            ./pomodify-frontend
          docker push $FRONTEND_IMAGE:$TAG_LATEST
          docker push $FRONTEND_IMAGE:$TAG_SHA

      - name: Build and push backend image
        run: |
          docker build -f pomodify-backend/Dockerfile \
            -t $BACKEND_IMAGE:$TAG_LATEST \
            -t $BACKEND_IMAGE:$TAG_SHA \
            ./pomodify-backend
          docker push $BACKEND_IMAGE:$TAG_LATEST
          docker push $BACKEND_IMAGE:$TAG_SHA

      - name: Install cosign
        uses: sigstore/cosign-installer@v3.4.0

      - name: Sign frontend images with cosign
        env:
          COSIGN_KEY_B64: ${{ secrets.COSIGN_KEY_B64 }}
          COSIGN_PASSWORD: ${{ secrets.COSIGN_PASSWORD }}
        run: |
          echo "$COSIGN_KEY_B64" | base64 -d > cosign.key
          ./cosign sign --yes --key cosign.key $FRONTEND_IMAGE:$TAG_SHA
          ./cosign sign --yes --key cosign.key $FRONTEND_IMAGE:$TAG_LATEST
          rm -f cosign.key

      - name: Sign backend images with cosign
        env:
          COSIGN_KEY_B64: ${{ secrets.COSIGN_KEY_B64 }}
          COSIGN_PASSWORD: ${{ secrets.COSIGN_PASSWORD }}
        run: |
          echo "$COSIGN_KEY_B64" | base64 -d > cosign.key
          ./cosign sign --yes --key cosign.key $BACKEND_IMAGE:$TAG_SHA
          ./cosign sign --yes --key cosign.key $BACKEND_IMAGE:$TAG_LATEST
          rm -f cosign.key

  deploy-to-ec2:
    name: Deploy to EC2 Server
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Install cosign for verification
        run: |
          curl -sSL -o cosign https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64
          chmod +x cosign

      - name: Verify image signatures before deploy
        env:
          COSIGN_PUBKEY_B64: ${{ secrets.COSIGN_PUBKEY_B64 }}
        run: |
          echo "$COSIGN_PUBKEY_B64" | base64 -d > cosign.pub
          ./cosign verify --key cosign.pub ${{ env.FRONTEND_IMAGE }}:${{ env.TAG_SHA }}
          ./cosign verify --key cosign.pub ${{ env.BACKEND_IMAGE }}:${{ env.TAG_SHA }}

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          port: ${{ secrets.SSH_PORT }}
          timeout: 30m
          command_timeout: 30m
          script: |
            set -e
            echo "🚀 Starting deployment to production..."
            
            # Stop old containers
            sudo docker stop pomodify-frontend pomodify-backend || true
            sudo docker rm pomodify-frontend pomodify-backend || true

            # Pull latest images
            sudo docker pull ${{ secrets.DOCKER_USERNAME }}/pomodify-frontend:latest
            sudo docker pull ${{ secrets.DOCKER_USERNAME }}/pomodify-backend:latest

            # Create network
            sudo docker network create pomodify-net || true

            # Start frontend
            sudo docker run -d \
              --name pomodify-frontend \
              --network pomodify-net \
              --restart unless-stopped \
              -p 8080:80 \
              ${{ secrets.DOCKER_USERNAME }}/pomodify-frontend:latest

            # Wait for database
            echo "Waiting for database..."
            retries=30
            until PGPASSWORD='${{ secrets.DB_PASSWORD }}' psql -h '${{ secrets.DB_HOST }}' \
              -U '${{ secrets.DB_USERNAME }}' -d '${{ secrets.DB_NAME }}' -p '${{ secrets.DB_PORT }}' \
              -c '\q' >/dev/null 2>&1; do
              retries=$((retries-1))
              if [ $retries -le 0 ]; then
                echo "❌ Database not reachable"
                exit 1
              fi
              sleep 5
            done
            echo "✅ Database is ready"

            # Setup upload directory
            sudo mkdir -p /data/pomodify/uploads/profile-pictures
            sudo chown -R 1000:1000 /data/pomodify/uploads

            # Start backend
            sudo docker run -d \
              --name pomodify-backend \
              --network pomodify-net \
              --restart unless-stopped \
              --memory="650m" \
              -p 8081:8081 \
              -v /data/pomodify/uploads:/app/uploads \
              -e JAVA_TOOL_OPTIONS="-Duser.timezone=Asia/Manila" \
              -e JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC" \
              -e SPRING_PROFILES_ACTIVE=prod \
              -e DB_URL=jdbc:postgresql://${{ secrets.DB_HOST }}:${{ secrets.DB_PORT }}/${{ secrets.DB_NAME }}?sslmode=require \
              -e DB_USERNAME=${{ secrets.DB_USERNAME }} \
              -e DB_PASSWORD=${{ secrets.DB_PASSWORD }} \
              -e JWT_SECRET=${{ secrets.JWT_SECRET }} \
              -e GOOGLE_CLIENT_ID=${{ secrets.GOOGLE_CLIENT_ID }} \
              -e GOOGLE_CLIENT_SECRET=${{ secrets.GOOGLE_CLIENT_SECRET }} \
              ${{ secrets.DOCKER_USERNAME }}/pomodify-backend:latest

            # Health checks
            echo "Checking frontend health..."
            retries=15
            until curl -f -s http://localhost:8080 >/dev/null 2>&1; do
              retries=$((retries-1))
              if [ $retries -le 0 ]; then
                echo "❌ Frontend health check failed"
                exit 1
              fi
              sleep 3
            done
            echo "✅ Frontend is healthy"

            echo "Checking backend health..."
            retries=60
            until curl -f -s http://localhost:8081/actuator/health >/dev/null 2>&1; do
              retries=$((retries-1))
              if [ $retries -le 0 ]; then
                echo "❌ Backend health check failed"
                exit 1
              fi
              sleep 5
            done
            echo "✅ Backend is healthy"

            echo "🎉 Deployment completed successfully!"

  verify-deployment:
    name: Deployment Summary
    needs: deploy-to-ec2
    runs-on: ubuntu-latest
    steps:
      - name: Show deployment summary
        run: |
          echo "🎉 DEPLOYMENT SUCCESSFUL!"
          echo "Commit SHA: ${{ github.sha }}"
          echo "Deployed by: ${{ github.actor }}"
```

---

## ENVIRONMENT CONFIGURATION

### Backend Environment Variables

#### Production (.env)
```properties
# Database
DB_URL=jdbc:postgresql://pomodifydb.cvwkscysw9h2.ap-southeast-2.rds.amazonaws.com:5432/pomodifydb?sslmode=require
DB_USERNAME=pomodify_user
DB_PASSWORD=<secure-password>
DDL_AUTO=update
SHOW_SQL=false

# JWT
JWT_SECRET=<256-bit-secure-key>
JWT_ACCESS_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=2592000000

# OAuth2
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>

# Email
SMTP_USERNAME=contact@pomodify.site
SMTP_PASSWORD=<secure-password>

# Firebase
FCM_SERVICE_ACCOUNT=/app/firebase-key.json

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<secure-password>

# Spring
SPRING_PROFILES_ACTIVE=prod
```

#### Development (application-dev.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pomodifydb
spring.datasource.username=pomodify_user
spring.datasource.password=pomodify_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

logging.level.root=INFO
logging.level.com.pomodify=DEBUG
```

#### Testing (application-test.properties)
```properties
spring.datasource.url=jdbc:tc:postgresql:15:///testdb
spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

logging.level.root=WARN
```

### Frontend Environment Configuration

#### API Configuration (src/app/core/config/api.config.ts)
```typescript
export const API_CONFIG = {
  production: {
    baseUrl: 'https://api.pomodify.site',
    timeout: 30000,
  },
  staging: {
    baseUrl: 'https://staging-api.pomodify.site',
    timeout: 30000,
  },
  development: {
    baseUrl: 'http://localhost:8081',
    timeout: 30000,
  },
};
```

#### Firebase Configuration (src/environments/environment.ts)
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCPV9y8EF0eVS3XKMoOt0KEbPofjj1zG3M',
    authDomain: 'pomodify-app.firebaseapp.com',
    projectId: 'pomodify-app',
    storageBucket: 'pomodify-app.appspot.com',
    messagingSenderId: '917889075843',
    appId: '1:917889075843:web:abc123def456',
    vapidKey: '<vapid-key>',
  },
};
```

---

## GITHUB SECRETS CONFIGURATION

### Required Secrets for CI/CD

```
# Docker Registry
DOCKER_USERNAME=<docker-hub-username>
DOCKER_PASSWORD=<docker-hub-password>

# Database
DB_HOST=pomodifydb.cvwkscysw9h2.ap-southeast-2.rds.amazonaws.com
DB_PORT=5432
DB_NAME=pomodifydb
DB_USERNAME=pomodify_user
DB_PASSWORD=<secure-password>

# JWT
JWT_SECRET=<256-bit-secure-key>
JWT_ACCESS_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=2592000000

# OAuth2
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>

# Email
SMTP_USERNAME=contact@pomodify.site
SMTP_PASSWORD=<secure-password>

# Firebase
FCM_SERVICE_ACCOUNT_BASE64=<base64-encoded-firebase-key>

# Image Signing
COSIGN_KEY_B64=<base64-encoded-cosign-key>
COSIGN_PASSWORD=<cosign-password>
COSIGN_PUBKEY_B64=<base64-encoded-cosign-public-key>

# SSH Deployment
SSH_HOST=<ec2-public-ip>
SSH_USER=ubuntu
SSH_KEY=<private-ssh-key>
SSH_PORT=22

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<secure-password>
```

---

## LOCAL DEVELOPMENT SETUP

### Prerequisites
```bash
# Java 21
java -version

# Maven 3.9.4
mvn -version

# Node.js 20
node -version
npm -version

# Docker
docker --version
docker-compose --version

# PostgreSQL Client
psql --version
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/your-org/pomodify.git
cd pomodify

# Backend setup
cd pomodify-backend
cp .env.example .env
# Edit .env with your local values
mvn clean install

# Frontend setup
cd ../pomodify-frontend
npm install --legacy-peer-deps

# Database setup
docker-compose up -d postgres
# Wait for PostgreSQL to start
sleep 10

# Run migrations
cd ../pomodify-backend
mvn flyway:migrate
```

### Running Locally
```bash
# Terminal 1: Backend
cd pomodify-backend
mvn spring-boot:run

# Terminal 2: Frontend
cd pomodify-frontend
npm start

# Terminal 3: Database (if not using Docker Compose)
docker run -d \
  --name postgres \
  -e POSTGRES_DB=pomodifydb \
  -e POSTGRES_USER=pomodify_user \
  -e POSTGRES_PASSWORD=pomodify_password \
  -p 5432:5432 \
  postgres:15-alpine
```

### Accessing Services
```
Frontend: http://localhost:4200
Backend: http://localhost:8081
Database: localhost:5432
```

---

**Continue to PART 4 for Security, Testing & Monitoring...**
