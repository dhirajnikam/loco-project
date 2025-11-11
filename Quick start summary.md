# 🚀 LOCO PROJECT - QUICK START GUIDE

## 📁 WHAT I CREATED FOR YOU

I've created **3 complete documents** for building the Loco Locomotive Pilot Assessment System:

1. **CLAUDE-CODE-COMPLETE-GUIDE.md** - Part 1: Setup through Auth Module
2. **CLAUDE-CODE-COMPLETE-GUIDE-PART-2.md** - Part 2: All remaining modules
3. **loco-project-specification.md** - Technical specification reference

---

## ⚡ QUICK START COMMANDS

### Step 1: Create Project
```bash
npm install -g @nestjs/cli
nest new loco-backend
cd loco-backend
```

### Step 2: Install All Dependencies
```bash
npm install @nestjs/mongoose mongoose @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer @nestjs/swagger swagger-ui-express @nestjs/throttler helmet compression
npm install -D @types/bcrypt @types/passport-jwt
```

### Step 3: Create .env File
```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
MONGODB_URI=mongodb://localhost:27017/loco-assessment
JWT_SECRET=loco-secret-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
BCRYPT_ROUNDS=10
RATE_LIMIT_TTL=900
RATE_LIMIT_MAX=100
FRONTEND_URL=http://localhost:3001
```

### Step 4: Start MongoDB
```bash
# Option 1: Local
mongod

# Option 2: Docker
docker run -d -p 27017:27017 --name loco-mongo mongo:7.0
```

### Step 5: Run Development Server
```bash
npm run start:dev
```

### Step 6: Access API Documentation
Open browser: **http://localhost:3000/api/docs**

---

## 📂 PROJECT STRUCTURE TO CREATE

```
loco-backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication (JWT, Login, Register)
│   │   ├── users/         # User management
│   │   ├── candidates/    # Candidate management
│   │   ├── tests/         # Test templates
│   │   ├── test-sessions/ # Active test sessions
│   │   ├── results/       # Test results
│   │   ├── analytics/     # Analytics & metrics
│   │   └── reports/       # Report generation
│   ├── common/
│   │   ├── decorators/    # Custom decorators
│   │   ├── guards/        # Auth guards
│   │   └── constants/     # Constants
│   ├── config/
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .gitignore
└── package.json
```

---

## 🎯 MODULES TO BUILD (IN ORDER)

### Phase 1: Foundation
1. ✅ Common files (decorators, guards, constants)
2. ✅ Users Module (User schema, CRUD operations)
3. ✅ Auth Module (JWT, Login, Register)

### Phase 2: Core Features
4. ✅ Candidates Module (Candidate registration & management)
5. ✅ Tests Module (Test templates with questions)
6. ✅ Test Sessions Module (Session lifecycle, answers)
7. ✅ Results Module (Score calculation, grading)

### Phase 3: Analytics & Reports
8. ✅ Analytics Module (Dashboard, performance metrics)
9. ✅ Reports Module (Candidate reports, batch reports)

---

## 🔑 KEY FILES TO CREATE

### Main Configuration
- `src/main.ts` - App bootstrap with Swagger
- `src/app.module.ts` - Root module with all imports
- `.env` - Environment variables

### Common Files
- `src/common/constants/roles.constant.ts` - User roles enum
- `src/common/decorators/roles.decorator.ts` - Role decorator
- `src/common/decorators/public.decorator.ts` - Public routes
- `src/common/decorators/current-user.decorator.ts` - Get current user
- `src/common/guards/roles.guard.ts` - Role-based guard

### Each Module Needs:
- `schemas/*.schema.ts` - Mongoose schema
- `dto/*.dto.ts` - Data transfer objects
- `*.service.ts` - Business logic
- `*.controller.ts` - API endpoints
- `*.module.ts` - Module definition

---

## 🧪 TESTING THE API

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test@123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### 3. Use Token
Copy the `accessToken` from login response and use it:
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 WHAT THE SYSTEM DOES

### For Candidates:
- Register and create profile
- Take assigned tests
- View test results
- Track application status

### For Evaluators:
- Create and manage tests
- Assign tests to candidates
- Monitor test sessions
- View results and generate reports

### For Admins:
- Full system access
- User management
- System configuration
- Analytics dashboard

### Test Types Supported:
1. **Concentration Test** - Attention and focus
2. **Reaction Test** - Response time
3. **Visual Test** - Visual perception
4. **Memory Test** - Memory capacity
5. **Field Independence Test** - Cognitive flexibility

---

## 🔐 DEFAULT USERS (After Seeding)

```
Admin: admin@loco.com / Admin@123
Evaluator: evaluator@loco.com / Eval@123
Candidate: candidate@loco.com / Cand@123
```

---

## 📡 API ENDPOINTS OVERVIEW

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Get profile

### Users
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Candidates
- `GET /api/v1/candidates` - List candidates
- `POST /api/v1/candidates` - Create candidate
- `GET /api/v1/candidates/:id` - Get candidate
- `PATCH /api/v1/candidates/:id` - Update candidate

### Tests
- `GET /api/v1/tests` - List tests
- `POST /api/v1/tests` - Create test
- `GET /api/v1/tests/:id` - Get test
- `PATCH /api/v1/tests/:id` - Update test

### Test Sessions
- `POST /api/v1/sessions` - Create session
- `PATCH /api/v1/sessions/:id/start` - Start session
- `POST /api/v1/sessions/:id/answer` - Submit answer
- `POST /api/v1/sessions/:id/submit` - Submit session

### Results
- `GET /api/v1/results` - List results
- `POST /api/v1/results/generate/:sessionId` - Generate result
- `GET /api/v1/results/candidate/:id` - Candidate results

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard metrics
- `GET /api/v1/analytics/test-performance` - Test analytics

### Reports
- `GET /api/v1/reports/candidate/:id` - Candidate report

---

## 🐛 TROUBLESHOOTING

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Or check Docker
docker ps | grep mongo
```

### Port 3000 Already in Use
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 REFERENCE DOCUMENTS

1. **CLAUDE-CODE-COMPLETE-GUIDE.md** (Part 1)
   - Project initialization
   - Common files setup
   - Users module (complete code)
   - Auth module (complete code)

2. **CLAUDE-CODE-COMPLETE-GUIDE-PART-2.md** (Part 2)
   - Candidates module
   - Tests module
   - Test Sessions module
   - Results module
   - Analytics module
   - Reports module
   - Final deployment steps

3. **loco-project-specification.md**
   - Complete technical specification
   - Architecture details
   - Database schemas
   - API design guidelines

---

## ✅ SUCCESS CHECKLIST

Your implementation is complete when:

- [ ] App starts without errors (`npm run start:dev`)
- [ ] MongoDB connection successful
- [ ] Swagger docs accessible at `/api/docs`
- [ ] Can register new user
- [ ] Can login and receive JWT token
- [ ] Can access protected routes with token
- [ ] All modules imported in `app.module.ts`
- [ ] All endpoints responding correctly
- [ ] Guards and decorators working
- [ ] Database schemas created

---

## 🎉 NEXT STEPS

After basic implementation:

1. **Add Unit Tests**
   ```bash
   npm run test
   ```

2. **Add E2E Tests**
   ```bash
   npm run test:e2e
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Add More Features**
   - File uploads (candidate documents)
   - Email notifications
   - PDF report generation
   - Real-time proctoring
   - Advanced analytics charts

---

## 🔗 USEFUL COMMANDS

```bash
# Generate new module
nest g module modules/module-name

# Generate controller
nest g controller modules/module-name

# Generate service
nest g service modules/module-name

# Build for production
npm run build

# Run production
npm run start:prod

# Format code
npm run format

# Lint code
npm run lint
```

---

## 💡 TIPS FOR CLAUDE CODE

1. **Follow the guides in exact order** - Part 1 first, then Part 2
2. **Copy entire code blocks** - Don't modify unless necessary
3. **Create all folders first** - Use the folder structure shown
4. **Test after each module** - Make sure it works before moving on
5. **Use Swagger docs** - Best way to test APIs visually
6. **Check MongoDB** - Ensure it's running before starting app
7. **Read error messages** - They usually point to the exact issue

---

## 📞 NEED HELP?

If you encounter issues:

1. Check MongoDB is running
2. Verify all environment variables in `.env`
3. Ensure all dependencies installed
4. Check for typos in file paths
5. Review error messages in console
6. Use Swagger docs to test endpoints
7. Check MongoDB Compass to verify data

---

## 🎊 YOU'RE READY!

Follow the complete guides in:
1. CLAUDE-CODE-COMPLETE-GUIDE.md (Part 1)
2. CLAUDE-CODE-COMPLETE-GUIDE-PART-2.md (Part 2)

Everything is documented with:
- ✅ Exact commands to run
- ✅ Complete code for every file
- ✅ Step-by-step instructions
- ✅ Testing procedures
- ✅ Troubleshooting tips

**Start building and good luck! 🚀**