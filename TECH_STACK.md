# Servify - Tech Stack & Project Documentation

## Project Overview
Servify is a full-stack web application built with modern technologies for containerized deployment. It features a React-based frontend, Node.js backend API, and PostgreSQL database, all orchestrated with Docker Compose.

---

## Tech Stack

### Frontend
- **Framework**: React 19.2.0
  - Modern UI library for building interactive user interfaces
  - Component-based architecture
  
- **Build Tool**: Vite 7.3.1
  - Lightning-fast build tool and dev server
  - HMR (Hot Module Replacement) for faster development
  - Optimized production bundling
  
- **Plugin**: @vitejs/plugin-react 5.1.1
  - React Fast Refresh support for HMR
  
- **Linting**: ESLint 9.39.1
  - Code quality and style enforcement
  - Plugins:
    - @eslint/js - JavaScript standards
    - eslint-plugin-react-hooks - React hooks best practices
    - eslint-plugin-react-refresh - React Refresh validation
  
- **Type Checking**: TypeScript types available
  - @types/react 19.2.7
  - @types/react-dom 19.2.3

### Backend
- **Runtime**: Node.js (CommonJS)
  - JavaScript runtime for server-side development
  
- **Framework**: Express.js 5.2.1
  - Minimalist web framework for building REST APIs
  - Middleware support for routing, CORS, and more
  
- **Database Driver**: pg 8.18.0
  - PostgreSQL client for Node.js
  - Handles database connections and queries
  
- **Authentication**: JWT (jsonwebtoken 9.0.3)
  - JSON Web Tokens for stateless authentication
  
- **Password Hashing**: bcrypt 6.0.0
  - Secure password encryption and verification
  
- **CORS**: cors 2.8.6
  - Cross-Origin Resource Sharing middleware
  - Configured for localhost development
  
- **Environment Variables**: dotenv 17.3.1
  - Loads environment variables from .env file
  
- **Development**: nodemon 3.1.11
  - Auto-restart server on file changes during development

### Database
- **DBMS**: PostgreSQL 15 (Alpine)
  - Powerful, open-source relational database
  - Alpine variant for lightweight Docker images
  
- **Hosting**: Docker Container
  - Persistent data with named volumes

---

## Architecture

### Project Structure
```
Servify/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service calls
│   │   ├── assets/        # Static assets (images, etc.)
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── server/                # Express backend
│   ├── config/
│   │   └── DB.js          # Database configuration
│   ├── controllers/       # Request handlers
│   ├── routes/            # API route definitions
│   ├── models/            # Database models/queries
│   ├── migrations/        # Database schema migrations
│   ├── index.js           # Server entry point
│   ├── migrate.js         # Migration runner
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml     # Multi-container orchestration
├── package.json          # Root workspace config
└── README.md
```

### Directory Purposes

#### Client (`/client`)
- **components/**: Reusable React components (buttons, forms, headers, etc.)
- **pages/**: Full-page components (Home, About, Dashboard, etc.)
- **services/**: API client methods for backend communication
- **assets/**: Images, fonts, and other static resources
- **src/main.jsx**: React DOM render point
- **src/App.jsx**: Root component and routing logic

#### Server (`/server`)
- **config/DB.js**: PostgreSQL connection pool and configuration
- **controllers/**: Business logic and request handlers (one per resource)
- **routes/**: Express route definitions (one per resource)
- **models/**: Database queries and data access layer
- **migrations/**: Database schema changes (create tables, alter columns, etc.)
- **index.js**: Server initialization and middleware setup
- **migrate.js**: Script to run pending migrations

---

## Docker Setup

### Services
1. **servify-backend** (Port 3000)
   - Express server handling API requests
   - Depends on PostgreSQL database
   
2. **servify-frontend** (Port 5173)
   - React development/production server
   - Depends on backend for API calls
   
3. **servify-db** (Port 5432)
   - PostgreSQL 15 database
   - Persistent volume: `postgres_data`

### Docker Compose Configuration
- **Network**: servify-network (allows inter-container communication)
- **Restart Policy**: unless-stopped (auto-restart on failure)
- **Environment Variables**: Loaded from .env file
  - `DB_USERNAME`: PostgreSQL user
  - `DB_PASSWORD`: PostgreSQL password
  - `DB_HOST`: Database hostname (postgres)
  - `DB_PORT`: Database port (5432)
  - `DB_NAME`: Database name
  - `PORT`: Backend server port (3000)

### Container Communication
- Frontend → Backend: `http://localhost:3000` (dev) or service name via network
- Backend → Database: `postgres:5432` (via Docker network)

---

## Development Tools & Scripts

### Client Scripts (`/client/package.json`)
```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

### Server Scripts (`/server/package.json`)
```bash
npm test         # Run tests (not yet configured)
```

### Development Dependencies
- **Vite**: Fast, modern build tool with HMR
- **nodemon**: Auto-restart server on changes
- **ESLint**: Code quality and consistency
- **TypeScript types**: Better IDE support and type safety

---

## API & Security

### CORS Configuration
- **Allowed Origins** (in development):
  - `http://localhost:3000`
  - `http://localhost:5173`
- **Method**: Whitelist-based CORS policy

### Authentication
- **JWT (JSON Web Tokens)**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds

### Database Connection
- **Pool-based**: Efficient connection management
- **Environment-based**: Configuration via .env file

---

## Environment Variables Required
Create a `.env` file in the root with:
```
DB_USERNAME=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=servify_db
```

---

## Development Workflow

1. **Frontend Development**
   - Edit React components in `/client/src/`
   - Vite provides HMR for instant updates
   - Run `npm run lint` to check code quality

2. **Backend Development**
   - Edit Express routes/controllers in `/server`
   - nodemon auto-restarts server on changes
   - Connect to PostgreSQL via pg driver

3. **Database Changes**
   - Create migration files in `/server/migrations/`
   - Run migrations with `npm run migrate` (if configured)
   - Models in `/server/models/` handle queries

4. **Containerization**
   - Build and run all services: `docker-compose up --build`
   - View logs: `docker-compose logs -f`
   - Stop services: `docker-compose down`

---

## Dependencies Summary

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| **Frontend Framework** | react | ^19.2.0 | UI library |
| **Frontend Bundler** | vite | ^7.3.1 | Build tool |
| **Backend Framework** | express | ^5.2.1 | Web server |
| **Database** | pg | ^8.18.0 | PostgreSQL client |
| **Authentication** | jsonwebtoken | ^9.0.3 | JWT handling |
| **Security** | bcrypt | ^6.0.0 | Password hashing |
| **Middleware** | cors | ^2.8.6 | CORS handling |
| **Config** | dotenv | ^17.3.1 | Environment variables |
| **Dev Tool** | nodemon | ^3.1.11 | Auto-restart |
| **Linting** | eslint | ^9.39.1 | Code quality |

---

## Getting Started

### Prerequisites
- Node.js 18+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- PostgreSQL 15 (only if not using Docker)

### Local Development
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Create .env file with database credentials
echo "DB_USERNAME=postgres" > ../.env
echo "DB_PASSWORD=password" >> ../.env
echo "DB_NAME=servify_db" >> ../.env

# Start backend (from server directory)
npm start

# Start frontend (from client directory)
npm run dev
```

### Docker Deployment
```bash
# Build and start all services
docker-compose up --build

# View services
docker-compose ps

# Stop services
docker-compose down
```

---

## License
ISC

## Repository
https://github.com/mamasalanang-gerald/Servify
