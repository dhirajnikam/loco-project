# Loco - Locomotive Pilot Assessment System

A comprehensive backend API system for conducting psychological and cognitive assessments for locomotive pilot candidates.

## 🚀 Project Overview

**Loco** is a NestJS-based backend system designed to manage and conduct various cognitive and psychological tests for train pilot candidates. The system supports multiple test types, real-time session management, automated grading, and detailed analytics.

### Test Types Supported
1. **Concentration Test** - Attention and focus assessment
2. **Reaction Test** - Response time measurement
3. **Visual Test** - Visual perception evaluation
4. **Memory Test** - Memory capacity testing
5. **Field Independence Test** - Cognitive flexibility assessment

## 📋 Technology Stack

- **Framework**: NestJS 10.x (Node.js framework)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Security**: Helmet, Rate Limiting, CORS, bcrypt

## 🏗️ Architecture

### Module Structure
```
src/
├── modules/
│   ├── auth/           # Authentication & JWT
│   ├── users/          # User management
│   ├── candidates/     # Candidate registration & profiles
│   ├── tests/          # Test templates & questions
│   ├── test-sessions/  # Active test sessions
│   ├── results/        # Test results & grading
│   ├── analytics/      # Dashboard & metrics
│   └── reports/        # Report generation
├── common/
│   ├── decorators/     # Custom decorators (@Roles, @Public, @CurrentUser)
│   ├── guards/         # Authorization guards
│   └── constants/      # Role definitions
└── main.ts             # Application bootstrap
```

### User Roles
- **Admin**: Full system access, user management
- **Evaluator**: Test creation, candidate management, result viewing
- **Supervisor**: Read-only access to analytics and reports
- **Candidate**: Test taking, result viewing (limited)

## 🔧 Installation

### Prerequisites
- Node.js v18+
- MongoDB 5.0+
- npm or yarn

### Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

MONGODB_URI=mongodb://localhost:27017/loco-assessment

JWT_SECRET=loco-secret-key-change-this-in-production-12345678
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=loco-refresh-secret-key-change-this
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_ROUNDS=10
RATE_LIMIT_TTL=900
RATE_LIMIT_MAX=100

FRONTEND_URL=http://localhost:3001
```

3. **Start MongoDB**

Using Docker:
```bash
docker run -d -p 27017:27017 --name loco-mongo mongo:7.0
```

Or install locally:
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start service
mongod
```

4. **Run the Application**

Development mode:
```bash
npm run start:dev
```

Production build:
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, access the interactive Swagger documentation at:

**http://localhost:3000/api/docs**

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user (Public)
- `POST /api/v1/auth/login` - User login (Public)
- `GET /api/v1/auth/profile` - Get current user profile

### Users
- `GET /api/v1/users` - List all users (Admin, Evaluator)
- `POST /api/v1/users` - Create user (Admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin)

### Candidates
- `GET /api/v1/candidates` - List candidates (Admin, Evaluator, Supervisor)
- `POST /api/v1/candidates` - Register candidate (Admin, Evaluator)
- `GET /api/v1/candidates/:id` - Get candidate details
- `PATCH /api/v1/candidates/:id` - Update candidate (Admin, Evaluator)
- `DELETE /api/v1/candidates/:id` - Delete candidate (Admin)

### Tests
- `GET /api/v1/tests` - List all tests
- `POST /api/v1/tests` - Create test template (Admin, Evaluator)
- `GET /api/v1/tests/:id` - Get test by ID
- `PATCH /api/v1/tests/:id` - Update test (Admin, Evaluator)
- `DELETE /api/v1/tests/:id` - Delete test (Admin)

### Test Sessions
- `GET /api/v1/sessions` - List sessions (Admin, Evaluator, Supervisor)
- `POST /api/v1/sessions` - Create session (Admin, Evaluator)
- `GET /api/v1/sessions/:id` - Get session details
- `PATCH /api/v1/sessions/:id/start` - Start test session
- `POST /api/v1/sessions/:id/answer` - Submit answer
- `POST /api/v1/sessions/:id/submit` - Complete and submit session

### Results
- `GET /api/v1/results` - List all results (Admin, Evaluator, Supervisor)
- `POST /api/v1/results/generate/:sessionId` - Generate result (Admin, Evaluator)
- `GET /api/v1/results/candidate/:id` - Get candidate results
- `GET /api/v1/results/:id` - Get result by ID

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard metrics (Admin, Evaluator, Supervisor)
- `GET /api/v1/analytics/test-performance` - Test performance stats

### Reports
- `GET /api/v1/reports/candidate/:id` - Generate candidate report (Admin, Evaluator, Supervisor)

## 🧪 Testing the API

### 1. Register a New User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@example.com",
    "username": "candidate1",
    "password": "Test@123456",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@example.com",
    "password": "Test@123456"
  }'
```

### 3. Access Protected Route
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔒 Security Features

- **JWT Authentication**: Token-based authentication with 15-minute expiry
- **Password Hashing**: bcrypt with 10 rounds
- **Role-Based Access Control**: Fine-grained permissions per endpoint
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Input Validation**: DTO validation with class-validator
- **Environment Variables**: Sensitive data in .env files

## 📊 Database Schema

### User Collection
```javascript
{
  email: String (unique, required),
  username: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: Enum ['admin', 'evaluator', 'supervisor', 'candidate'],
  phone: String,
  isActive: Boolean,
  isEmailVerified: Boolean,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Candidate Collection
```javascript
{
  userId: ObjectId (ref: User, unique),
  applicationNumber: String (auto-generated, unique),
  personalInfo: {
    dateOfBirth: Date,
    gender: Enum ['male', 'female', 'other'],
    nationality: String
  },
  contactInfo: {
    primaryPhone: String,
    secondaryPhone: String
  },
  applicationStatus: Enum ['pending', 'under_review', 'test_assigned', 'tested', 'selected', 'rejected'],
  assignedTests: [ObjectId],
  testResults: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Test Collection
```javascript
{
  title: String,
  description: String,
  testType: Enum ['concentration', 'reaction', 'visual', 'memory', 'field-independence'],
  difficulty: Enum ['easy', 'medium', 'hard'],
  duration: Number (minutes),
  passingScore: Number,
  totalMarks: Number,
  questions: [{
    questionId: ObjectId,
    questionText: String,
    questionType: String,
    options: [{ optionText: String, isCorrect: Boolean }],
    marks: Number
  }],
  isActive: Boolean,
  isPublished: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Test Session Collection
```javascript
{
  sessionCode: String (auto-generated, unique),
  candidateId: ObjectId (ref: Candidate),
  testId: ObjectId (ref: Test),
  status: Enum ['scheduled', 'in_progress', 'paused', 'completed', 'abandoned'],
  startedAt: Date,
  completedAt: Date,
  answers: [{
    questionId: ObjectId,
    selectedAnswer: Mixed,
    isCorrect: Boolean,
    timeTaken: Number,
    score: Number
  }],
  score: {
    totalQuestions: Number,
    attempted: Number,
    correct: Number,
    incorrect: Number,
    totalMarks: Number,
    obtainedMarks: Number,
    percentage: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Result Collection
```javascript
{
  sessionId: ObjectId (ref: TestSession, unique),
  candidateId: ObjectId (ref: Candidate),
  testId: ObjectId (ref: Test),
  testType: String,
  score: {
    totalMarks: Number,
    obtainedMarks: Number,
    percentage: Number,
    grade: String,
    passed: Boolean
  },
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Grading System

- **A+**: 90% and above
- **A**: 80% - 89%
- **B**: 70% - 79%
- **C**: 60% - 69%
- **D**: 50% - 59%
- **F**: Below 50%

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start          # Start in regular mode
npm run start:dev      # Start in watch mode
npm run start:debug    # Start in debug mode

# Build
npm run build          # Compile TypeScript

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint
```

### Generate New Module

```bash
nest g module modules/module-name
nest g controller modules/module-name
nest g service modules/module-name
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Or check Docker container
docker ps | grep mongo
docker logs loco-mongo
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📦 Deployment

### Docker Deployment

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/loco-assessment
      - JWT_SECRET=your-production-secret
    depends_on:
      - mongodb

volumes:
  mongo-data:
```

Run with:
```bash
docker-compose up -d
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the development team

## ✅ Project Status

✅ Complete and Production Ready

**Features Implemented:**
- ✅ User authentication & authorization
- ✅ Role-based access control (4 roles)
- ✅ Candidate management with auto-generated application numbers
- ✅ Test template creation (5 test types)
- ✅ Test session management with real-time tracking
- ✅ Automated scoring and grading
- ✅ Analytics dashboard
- ✅ Report generation
- ✅ API documentation (Swagger)
- ✅ Security features (JWT, bcrypt, rate limiting, CORS)
- ✅ Input validation
- ✅ Database indexing for performance
- ✅ Pagination support

---

**Built with ❤️ using NestJS**
