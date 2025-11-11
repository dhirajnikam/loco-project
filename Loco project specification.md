# Loco Project - Technical Specification Document

## Project Overview
**Project Name:** Loco  
**Backend Framework:** NestJS  
**Database:** MongoDB  
**Purpose:** [To be defined based on project requirements]

---

## Technology Stack

### Backend
- **Framework:** NestJS (Node.js framework)
- **Language:** TypeScript
- **Runtime:** Node.js (v18+ recommended)

### Database
- **Primary Database:** MongoDB
- **ODM:** Mongoose
- **Database Hosting:** MongoDB Atlas (recommended for production)

### Additional Technologies
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI
- **Authentication:** JWT (JSON Web Tokens)
- **Environment Management:** dotenv, @nestjs/config
- **Testing:** Jest, Supertest

---

## Project Structure

```
loco-backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── schemas/
│   │   │   └── dto/
│   │   └── [other-modules]/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── interfaces/
│   ├── config/
│   │   └── configuration.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── .env
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Core Modules

### 1. Authentication Module
**Purpose:** Handle user authentication and authorization

**Features:**
- User registration
- User login
- JWT token generation and validation
- Password hashing (bcrypt)
- Refresh token mechanism
- Role-based access control (RBAC)

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get current user profile

### 2. Users Module
**Purpose:** Manage user data and profiles

**Features:**
- CRUD operations for users
- User profile management
- User search and filtering
- Role and permission management

**Endpoints:**
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/search` - Search users

---

## Database Schema Design

### User Schema
```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  username: string (unique, required),
  password: string (hashed, required),
  firstName: string,
  lastName: string,
  role: enum ['user', 'admin', 'moderator'],
  isActive: boolean (default: true),
  isEmailVerified: boolean (default: false),
  avatar: string (URL),
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### Additional Schemas
*To be defined based on specific project requirements*

---

## API Design

### REST