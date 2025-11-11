# Loco Locomotive Pilot Assessment System

A comprehensive web-based assessment platform for evaluating locomotive pilot candidates through various psychometric tests.

## Overview

The Loco system enables railway authorities to assess candidates through multiple test types including concentration, reaction time, visual perception, memory, and field independence tests. The platform supports role-based access control with different user types managing various aspects of the assessment process.

## Technology Stack

### Backend
- **Framework**: NestJS 10.x (Node.js framework)
- **Language**: TypeScript
- **Runtime**: Node.js v18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with Passport.js
- **Security**: bcrypt password hashing, helmet, CORS, rate limiting
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 18.x
- **Language**: TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Styling**: CSS3 with responsive design
- **Testing**: React Testing Library, Jest

### Development Tools
- **Linting**: ESLint
- **Package Manager**: npm
- **Version Control**: Git

## User Types

The system supports **4 different user roles**:

### 1. **ADMIN**
- Full system access and configuration
- User management (create, update, delete users)
- System-wide settings and permissions
- Access to all modules and features
- View all analytics and reports

### 2. **EVALUATOR**
- Create and manage assessment tests
- Assign tests to candidates
- View candidate profiles and results
- Monitor test sessions
- Generate individual test reports

### 3. **SUPERVISOR**
- View system-wide analytics
- Access performance reports
- Monitor candidate statistics
- View test completion rates
- Generate analytical reports

### 4. **CANDIDATE**
- Take assigned tests
- View personal test results
- Update profile information
- Track assessment progress
- Limited system access

## Project Structure

```
loco-project/
├── loco-backend/          # NestJS backend application
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   │   ├── auth/      # Authentication & authorization
│   │   │   ├── users/     # User management
│   │   │   ├── candidates/# Candidate profiles
│   │   │   ├── tests/     # Test definitions
│   │   │   ├── test-sessions/ # Test execution
│   │   │   ├── results/   # Test results
│   │   │   ├── analytics/ # System analytics
│   │   │   └── reports/   # Report generation
│   │   ├── common/        # Shared utilities
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   └── constants/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/              # E2E tests
│   └── package.json
│
└── loco-frontend/         # React frontend application
    ├── src/
    │   ├── components/    # Reusable components
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── Loading.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── contexts/      # React contexts
    │   │   └── AuthContext.tsx
    │   ├── pages/         # Page components
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   └── Dashboard.tsx
    │   ├── services/      # API services
    │   │   └── api.ts
    │   ├── types/         # TypeScript types
    │   └── App.tsx
    └── package.json
```

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing
- Protected routes and API endpoints

### Assessment Management
- Multiple test types (Concentration, Reaction, Visual, Memory, Field Independence)
- Test session management
- Real-time test monitoring
- Result calculation and storage

### Analytics & Reporting
- Dashboard with key metrics
- Candidate performance analytics
- Test completion statistics
- Pass rate tracking
- Customizable reports

### User Management
- Complete CRUD operations
- Profile management
- Role assignment
- Active/inactive status control

## Test Coverage

### Backend Tests: 23 tests ✅
- Auth Service: 7 tests
- Users Service: 8 tests
- Candidates Service: 8 tests
- **Execution Time**: ~4.5 seconds

### Frontend Tests: 23 tests ✅
- Login Component: 6 tests
- Register Component: 8 tests
- Dashboard Component: 7 tests
- App Component: 2 tests
- **Code Coverage**: 52.99%
- **Execution Time**: ~10.4 seconds

### Total: 46 tests passing (100% success rate)

## Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd loco-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Run development server
npm run start:dev

# Run tests
npm test

# Run tests with coverage
npm run test:cov
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd loco-frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# REACT_APP_API_URL=http://localhost:3000

# Run development server
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build
```

Frontend runs on `http://localhost:3001`

## API Documentation

Once the backend is running, access Swagger documentation at:
```
http://localhost:3000/api
```

## Key API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get current user profile

### Users (Admin only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Candidates
- `GET /api/v1/candidates` - Get all candidates
- `POST /api/v1/candidates` - Create candidate
- `GET /api/v1/candidates/:id` - Get candidate details
- `PATCH /api/v1/candidates/:id` - Update candidate

### Tests
- `GET /api/v1/tests` - Get all tests
- `POST /api/v1/tests` - Create test
- `GET /api/v1/tests/:id` - Get test details

### Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard metrics

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/loco-assessment
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d
FRONTEND_URL=http://localhost:3001
API_PREFIX=api/v1
RATE_LIMIT_TTL=900
RATE_LIMIT_MAX=100
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000
```

## Database Schema

### User Schema
```typescript
{
  email: string (unique, required)
  username: string (unique, required)
  password: string (hashed, required)
  firstName: string (required)
  lastName: string (required)
  role: 'admin' | 'evaluator' | 'supervisor' | 'candidate'
  isActive: boolean (default: true)
  createdAt: Date
  updatedAt: Date
}
```

### Candidate Schema
```typescript
{
  userId: ObjectId (ref: User)
  applicationNumber: string (unique)
  personalInfo: {
    dateOfBirth: Date
    gender: string
    nationality: string
  }
  contactInfo: {
    primaryPhone: string
    alternatePhone: string
    address: object
  }
  applicationStatus: string
  assignedTests: ObjectId[]
  testResults: ObjectId[]
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for HTTP headers security
- Input validation and sanitization
- Protected routes (frontend & backend)

## Development Guidelines

### Running Tests
```bash
# Backend tests
cd loco-backend && npm test

# Frontend tests
cd loco-frontend && npm test

# With coverage
npm test -- --coverage
```

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful test cases
- Document complex logic
- Use descriptive variable names

### Git Workflow
1. Create feature branch from main
2. Make changes and write tests
3. Run tests locally
4. Commit with descriptive messages
5. Push and create pull request

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure MongoDB Atlas
4. Enable HTTPS
5. Set up environment variables
6. Build: `npm run build`
7. Start: `npm run start:prod`

### Frontend Deployment
1. Update API URL for production
2. Build: `npm run build`
3. Serve `build/` directory with web server
4. Configure HTTPS
5. Enable caching for static assets

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access (for Atlas)

**CORS Error**
- Verify FRONTEND_URL in backend .env
- Check REACT_APP_API_URL in frontend .env

**JWT Token Invalid**
- Clear localStorage in browser
- Re-login to get new token
- Verify JWT_SECRET matches

**Tests Failing**
- Clear Jest cache: `npm test -- --clearCache`
- Check Node version (v18+)
- Reinstall dependencies

## Contributing

1. Fork the repository
2. Create your feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

[Specify your license here]

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check documentation

## Acknowledgments

Built with NestJS, React, and MongoDB for railway locomotive pilot assessment.
