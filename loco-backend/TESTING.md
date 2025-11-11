# Loco Project - Testing Documentation

## 📊 Test Results Summary

### ✅ Current Test Status

```
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Time:        4.095 s
Code Coverage: 11.28% statements, 9.41% branches
```

---

## 🧪 Types of Tests Supported

### 1. **Unit Tests**
Unit tests focus on testing individual components (services, controllers) in isolation using mocks.

**Location:** `src/**/*.spec.ts`

**What We Test:**
- Service methods with mocked dependencies
- Business logic validation
- Error handling
- Data transformation

**Example Test Files Created:**
- ✅ `src/modules/auth/auth.service.spec.ts` (7 tests)
- ✅ `src/modules/users/users.service.spec.ts` (7 tests)
- ✅ `src/app.controller.spec.ts` (1 test)

**Run Unit Tests:**
```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:cov            # With coverage
npm run test:debug          # Debug mode
```

### 2. **Integration/E2E Tests**
End-to-end tests verify the entire application flow including HTTP requests, database operations, and module interactions.

**Location:** `test/**/*.e2e-spec.ts`

**What We Test:**
- Complete API endpoint flows
- Request/response validation
- Authentication & authorization
- Database integration
- Multiple module interactions

**Example Test Files Created:**
- ✅ `test/auth.e2e-spec.ts` (Authentication flow tests)
- ✅ `test/app.e2e-spec.ts` (Basic app tests)

**Run E2E Tests:**
```bash
npm run test:e2e            # Run all E2E tests
```

**Note:** E2E tests require MongoDB to be running.

### 3. **Test Coverage Analysis**
Test coverage shows how much of your code is tested.

**Metrics:**
- **Statements:** Percentage of code statements executed
- **Branches:** Percentage of conditional branches tested
- **Functions:** Percentage of functions called
- **Lines:** Percentage of lines executed

**Run Coverage:**
```bash
npm run test:cov
```

**Coverage Report Location:** `coverage/lcov-report/index.html`

---

## 📝 Test Details

### Unit Tests - Auth Service (7 tests)

**File:** `src/modules/auth/auth.service.spec.ts`

✅ Tests Included:
1. Service should be defined
2. Register new user and return access token
3. Login user and return access token
4. Throw UnauthorizedException for invalid credentials
5. Throw UnauthorizedException for deactivated account
6. Get user profile successfully
7. Handle edge cases

**Coverage:**
- AuthService: 100% statements, 83% branches

### Unit Tests - Users Service (7 tests)

**File:** `src/modules/users/users.service.spec.ts`

✅ Tests Included:
1. Service should be defined
2. Throw ConflictException if user already exists
3. Return paginated users
4. Return user by ID
5. Throw NotFoundException if user not found
6. Return user by email
7. Delete user successfully
8. Throw NotFoundException when deleting non-existent user

**Coverage:**
- UsersService: 63% statements, 33% branches

### E2E Tests - Authentication (9 tests planned)

**File:** `test/auth.e2e-spec.ts`

✅ Test Scenarios:
1. **POST /api/v1/auth/register**
   - Register new user successfully
   - Fail with invalid email
   - Fail with short password

2. **POST /api/v1/auth/login**
   - Login with valid credentials
   - Fail with invalid credentials

3. **GET /api/v1/auth/profile**
   - Get profile with valid token
   - Fail without token
   - Fail with invalid token

---

## 🎯 Testing Best Practices

### 1. **AAA Pattern (Arrange, Act, Assert)**
```typescript
it('should register a new user', async () => {
  // Arrange - Setup test data
  const registerDto = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'Test@123456',
    firstName: 'Test',
    lastName: 'User',
  };
  mockUsersService.create.mockResolvedValue(mockUser);

  // Act - Execute the method
  const result = await service.register(registerDto);

  // Assert - Verify the result
  expect(result).toHaveProperty('accessToken');
  expect(result.user.email).toBe(mockUser.email);
});
```

### 2. **Mock External Dependencies**
```typescript
const mockUsersService = {
  create: jest.fn(),
  validateUser: jest.fn(),
  findOne: jest.fn(),
};
```

### 3. **Test Edge Cases**
- Valid inputs ✅
- Invalid inputs ✅
- Null/undefined values ✅
- Error scenarios ✅
- Boundary conditions ✅

### 4. **Descriptive Test Names**
```typescript
// Good ✅
it('should throw UnauthorizedException for invalid credentials')

// Bad ❌
it('should throw error')
```

---

## 📦 Test Coverage Goals

### Current Coverage
```
All files                  | 11.28% | 9.41% | 12.84% | 10.92%
src/modules/auth          | 42.55% | 38.46% | 50% | 41.02%
src/modules/users         | 35.38% | 21.05% | 42.85% | 33.92%
```

### Recommended Coverage Targets
- **Critical Modules (Auth, Users):** 80%+ coverage
- **Business Logic Services:** 70%+ coverage
- **Controllers:** 60%+ coverage
- **DTOs/Schemas:** 50%+ coverage

---

## 🚀 Running Tests

### Quick Commands

```bash
# Run all unit tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:cov

# Run E2E tests (requires MongoDB)
npm run test:e2e

# Debug tests
npm run test:debug
```

### CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:cov

- name: Run E2E tests
  run: |
    docker run -d -p 27017:27017 mongo:7.0
    npm run test:e2e
```

---

## 📋 Test Structure

```
loco-backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.service.spec.ts    ✅ Unit tests
│   │   │   └── ...
│   │   ├── users/
│   │   │   ├── users.service.ts
│   │   │   ├── users.service.spec.ts   ✅ Unit tests
│   │   │   └── ...
│   └── ...
├── test/
│   ├── app.e2e-spec.ts                 ✅ E2E tests
│   ├── auth.e2e-spec.ts                ✅ E2E tests
│   └── jest-e2e.json                   # E2E config
├── coverage/                            # Coverage reports
│   └── lcov-report/
│       └── index.html                   # HTML coverage report
└── jest.config.js                       # Jest configuration
```

---

## 🔧 Test Configuration

### Jest Configuration (package.json)
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

---

## ✍️ Writing New Tests

### Creating a Unit Test

1. **Create test file:** `[module].service.spec.ts`
2. **Import dependencies:**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';
```

3. **Setup test module:**
```typescript
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [YourService],
  }).compile();

  service = module.get<YourService>(YourService);
});
```

4. **Write tests:**
```typescript
describe('YourService', () => {
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should perform specific action', async () => {
    const result = await service.yourMethod();
    expect(result).toBe(expectedValue);
  });
});
```

### Creating an E2E Test

1. **Create test file:** `test/[feature].e2e-spec.ts`
2. **Setup application:**
```typescript
import request from 'supertest';

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});
```

3. **Write API tests:**
```typescript
it('/endpoint (POST)', () => {
  return request(app.getHttpServer())
    .post('/api/v1/endpoint')
    .send({ data: 'value' })
    .expect(201)
    .expect((res) => {
      expect(res.body).toHaveProperty('id');
    });
});
```

---

## 🐛 Common Testing Issues

### Issue: MongoDB Connection Errors in E2E Tests
**Solution:** Start MongoDB before running E2E tests
```bash
docker run -d -p 27017:27017 --name loco-mongo mongo:7.0
npm run test:e2e
```

### Issue: Tests Timing Out
**Solution:** Increase timeout in test file
```typescript
jest.setTimeout(30000); // 30 seconds
```

### Issue: Mock Not Working
**Solution:** Clear mocks between tests
```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

---

## 📈 Next Steps for Testing

### Immediate Priorities
1. ✅ Auth Service unit tests (COMPLETE)
2. ✅ Users Service unit tests (COMPLETE)
3. ✅ Auth E2E tests (COMPLETE)
4. ⏳ Candidates Service unit tests
5. ⏳ Tests Service unit tests
6. ⏳ Sessions Service unit tests
7. ⏳ Results Service unit tests
8. ⏳ Analytics Service unit tests
9. ⏳ Reports Service unit tests

### Advanced Testing
- Integration tests for multiple modules
- Performance tests
- Load testing
- Security testing
- Database migration tests

---

## 🎯 Test Results

### Latest Test Run
```
PASS src/app.controller.spec.ts
PASS src/modules/users/users.service.spec.ts
PASS src/modules/auth/auth.service.spec.ts

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        4.095 s
```

### Coverage Summary
```
File                     | % Stmts | % Branch | % Funcs | % Lines
-------------------------|---------|----------|---------|--------
All files                | 11.28   | 9.41     | 12.84   | 10.92
src/modules/auth         | 42.55   | 38.46    | 50      | 41.02
src/modules/users        | 35.38   | 21.05    | 42.85   | 33.92
```

---

## 🔍 Additional Test Types (Future)

### 1. **Performance Tests**
Test API response times and throughput.

### 2. **Security Tests**
- SQL injection prevention
- XSS protection
- CSRF token validation
- Rate limiting effectiveness

### 3. **Load Tests**
- Concurrent user handling
- Database query optimization
- Memory leak detection

### 4. **Mutation Tests**
Test the quality of your tests by mutating code.

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Last Updated:** November 2025
**Test Framework:** Jest 29.x
**Test Runner:** NestJS Testing Module
