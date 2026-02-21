# Servify - Service Marketplace Platform

Welcome to Servify, a comprehensive service marketplace platform that connects service providers with clients. Built with modern technologies, Servify enables users to discover, book, and manage services seamlessly.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Testing](#testing)
- [Contributing](#contributing)

---

## ✨ Features

- **User Authentication:** Register, login, and token-based authentication (JWT)
- **User Roles:** Client, Service Provider, and Admin roles with role-based access
- **Service Management:** Create, read, update, and delete services
- **Service Categories:** Organize services by categories
- **Bookings System:** Clients can book services from providers
- **Reviews & Ratings:** Rate and review completed services
- **Responsive Frontend:** Modern React-based user interface
- **RESTful API:** Comprehensive API for all operations

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **Authentication:** JWT (JSON Web Tokens)
- **Utilities:** bcrypt (password hashing), dotenv, cors

### Frontend
- **Framework:** React (Vite)
- **Build Tool:** Vite
- **Styling:** CSS

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

---

## 📁 Project Structure

```
Servify/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── main.jsx
│   └── Dockerfile
│
├── server/                      # Express Backend
│   ├── config/                 # Database configuration
│   ├── controllers/            # Request handlers
│   ├── middlewares/            # Auth & role middleware
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── migrations/             # Database migrations
│   ├── index.js               # Server entry point
│   ├── migrate.js             # Migration runner
│   └── Dockerfile
│
├── SQLfiles/                   # Database initialization scripts
│   └── 01_init.pgsql          # Initial schema
│
├── docker-compose.yml         # Docker services orchestration
├── .env                       # Environment variables
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Servify
   ```

2. **Create environment file:**
   ```bash
   cp server/.env.example server/.env
   ```

3. **Update environment variables** (see Environment Variables section)

4. **Start with Docker Compose:**
   ```bash
   docker compose up
   ```

5. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000/api/v1`
   - Database: `localhost:5432`

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

#### Register User
```
POST /auth/register
Body: { "full_name", "email", "password", "phone_number" }
Response: { "message", "userId" }
```

#### Login User
```
POST /auth/login
Body: { "email", "password" }
Response: { "accessToken" }
```

#### Refresh Token
```
POST /auth/refresh
Body: { "refreshToken" }
Response: { "accessToken", "refreshToken" }
```

### Users

#### Get Profile
```
GET /users/profile
Auth: Required (Bearer Token)
Response: User object
```

#### Promote to Provider
```
PATCH /users/promote
Auth: Required (Bearer Token)
Body: {}
Response: { "message", "user", "accessToken", "refreshToken" }
```

#### Change User Role (Admin)
```
PATCH /users/:id/role
Auth: Required (Admin Role)
Body: { "user_type": "client|provider|admin" }
Response: { "message", "user" }
```

#### List All Users (Admin)
```
GET /users/
Auth: Required (Admin Role)
Response: Array of users
```

### Services

#### Get All Services
```
GET /services/
Response: Array of services
```

#### Get Service by ID
```
GET /services/:id
Response: Service object
```

#### Create Service
```
POST /services/create
Body: { "provider_id", "category_id", "title", "description", "price", "service_type", "location" }
Response: Created service object
```

#### Update Service
```
PUT /services/edit/:id
Body: { "title", "description", "price", "service_type", "location" }
Response: Updated service object
```

#### Delete Service
```
DELETE /services/:id
Response: Deleted service object
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_USERNAME=servify
DB_PASSWORD=servify_2347socia
DB_HOST=postgres
DB_PORT=5432
DB_NAME=servify

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_for_access_tokens_should_be_long_and_complex_2026
JWT_SECRET_REFRESH=your_jwt_refresh_secret_key_for_refresh_tokens_should_be_long_and_complex_2026
```

---

## 🐳 Docker Deployment

### Build Images
```bash
docker compose build
```

### Start Services
```bash
docker compose up
```

### Stop Services
```bash
docker compose down
```

### Remove Everything (including volumes)
```bash
docker compose down -v
```

### View Logs
```bash
docker compose logs -f servify-backend
docker compose logs -f servify-frontend
docker compose logs -f servify-db
```

---

## 🧪 Testing

### Using Postman

1. **Register a User:**
   - POST: `http://localhost:3000/api/v1/auth/register`
   - Body: `{ "full_name": "John Doe", "email": "john@example.com", "password": "securePassword123", "phone_number": "1234567890" }`

2. **Login:**
   - POST: `http://localhost:3000/api/v1/auth/login`
   - Body: `{ "email": "john@example.com", "password": "securePassword123" }`
   - Copy the `accessToken`

3. **Get Profile (with token):**
   - GET: `http://localhost:3000/api/v1/users/profile`
   - Header: `Authorization: Bearer <your_token>`

4. **Create Service:**
   - POST: `http://localhost:3000/api/v1/services/create`
   - Body: Service details

---

## 📊 Database Schema

### Users Table
- `id` (UUID): Primary key
- `full_name` (VARCHAR): User's full name
- `email` (VARCHAR): Unique email
- `password_hash` (TEXT): Hashed password
- `user_type` (VARCHAR): 'client' | 'provider' | 'admin'
- `phone_number` (VARCHAR): Contact number
- `is_verified` (BOOLEAN): Email verification status
- `created_at`, `updated_at` (TIMESTAMP)

### Services Table
- `id` (UUID): Primary key
- `provider_id` (UUID): Reference to users
- `category_id` (INT): Service category
- `title`, `description` (VARCHAR/TEXT)
- `price` (NUMERIC): Service cost
- `service_type` (VARCHAR): 'online' | 'onsite'
- `location` (VARCHAR): Service location
- `created_at`, `updated_at` (TIMESTAMP)

### Bookings Table
- `id` (UUID): Primary key
- `client_id`, `provider_id` (UUID): References to users
- `service_id` (UUID): Reference to services
- `status` (VARCHAR): 'pending' | 'confirmed' | 'completed' | 'cancelled'
- `booking_date` (TIMESTAMP): Scheduled date

### Reviews Table
- `id` (UUID): Primary key
- `provider_id`, `client_id` (UUID): References
- `rating` (INT): 1-5 scale
- `comment` (TEXT): Review text

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 📧 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Happy coding! 🚀**
