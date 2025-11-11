# 🚂 LOCO PROJECT - PART 2: REMAINING MODULES

**Continuation of Complete Implementation Guide**

---

## STEP 7: CREATE CANDIDATES MODULE

### 7.1 Generate Module

```bash
nest g module modules/candidates
nest g controller modules/candidates
nest g service modules/candidates
```

### 7.2 Create `src/modules/candidates/schemas/candidate.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CandidateDocument = Candidate & Document;

@Schema({ timestamps: true })
export class Candidate {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ unique: true, required: true })
  applicationNumber: string;

  @Prop({
    type: {
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      nationality: String,
    },
    _id: false,
  })
  personalInfo: {
    dateOfBirth: Date;
    gender: string;
    nationality?: string;
  };

  @Prop({
    type: {
      primaryPhone: { type: String, required: true },
      secondaryPhone: String,
    },
    _id: false,
  })
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
  };

  @Prop({
    type: String,
    enum: ['pending', 'under_review', 'test_assigned', 'tested', 'selected', 'rejected'],
    default: 'pending',
  })
  applicationStatus: string;

  @Prop([{ type: Types.ObjectId, ref: 'Test' }])
  assignedTests: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Result' }])
  testResults: Types.ObjectId[];
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
CandidateSchema.index({ userId: 1 });
CandidateSchema.index({ applicationNumber: 1 });

CandidateSchema.pre('save', async function (next) {
  if (!this.applicationNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.applicationNumber = `LOCO-${timestamp}-${random}`;
  }
  next();
});
```

### 7.3 Create `src/modules/candidates/dto/create-candidate.dto.ts`

```typescript
import { IsNotEmpty, IsString, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PersonalInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({ enum: ['male', 'female', 'other'] })
  @IsEnum(['male', 'female', 'other'])
  gender: string;
}

class ContactInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  primaryPhone: string;
}

export class CreateCandidateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ type: PersonalInfoDto })
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ApiProperty({ type: ContactInfoDto })
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}
```

### 7.4 Update Service and Controller

**`src/modules/candidates/candidates.service.ts`:**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate, CandidateDocument } from './schemas/candidate.schema';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<CandidateDocument>,
  ) {}

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const candidate = new this.candidateModel(createCandidateDto);
    return candidate.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [candidates, total] = await Promise.all([
      this.candidateModel.find().populate('userId', '-password').skip(skip).limit(limit).exec(),
      this.candidateModel.countDocuments(),
    ]);
    return { candidates, total };
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findById(id).populate('userId', '-password').exec();
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async update(id: string, updateData: any): Promise<Candidate> {
    const candidate = await this.candidateModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId', '-password')
      .exec();
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async remove(id: string): Promise<void> {
    const result = await this.candidateModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Candidate not found');
  }
}
```

**`src/modules/candidates/candidates.controller.ts`:**

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@ApiTags('candidates')
@ApiBearerAuth()
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR)
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR, UserRole.SUPERVISOR)
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.candidatesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.candidatesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }
}
```

**`src/modules/candidates/candidates.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { Candidate, CandidateSchema } from './schemas/candidate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Candidate.name, schema: CandidateSchema }]),
  ],
  controllers: [CandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
```

---

## STEP 8: CREATE TESTS MODULE

### 8.1 Generate Module

```bash
nest g module modules/tests
nest g controller modules/tests
nest g service modules/tests
```

### 8.2 Create Schema (Simplified for brevity)

**`src/modules/tests/schemas/test.schema.ts`:**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestDocument = Test & Document;

@Schema({ timestamps: true })
export class Test {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ['concentration', 'reaction', 'visual', 'memory', 'field-independence'],
    required: true,
  })
  testType: string;

  @Prop({ type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' })
  difficulty: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  passingScore: number;

  @Prop({ required: true })
  totalMarks: number;

  @Prop([{
    questionId: { type: Types.ObjectId, auto: true },
    questionText: String,
    questionType: String,
    options: [{
      optionText: String,
      isCorrect: Boolean,
    }],
    marks: Number,
  }])
  questions: Array<any>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const TestSchema = SchemaFactory.createForClass(Test);
TestSchema.index({ testType: 1 });
```

### 8.3 Complete Service and Controller

**`src/modules/tests/tests.service.ts`:**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestDocument } from './schemas/test.schema';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<TestDocument>,
  ) {}

  async create(createTestDto: any, userId: string): Promise<Test> {
    const test = new this.testModel({ ...createTestDto, createdBy: userId });
    return test.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [tests, total] = await Promise.all([
      this.testModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
      this.testModel.countDocuments({ isActive: true }),
    ]);
    return { tests, total };
  }

  async findOne(id: string): Promise<Test> {
    const test = await this.testModel.findById(id).exec();
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async findByType(testType: string): Promise<Test[]> {
    return this.testModel.find({ testType, isActive: true, isPublished: true }).exec();
  }

  async update(id: string, updateData: any): Promise<Test> {
    const test = await this.testModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async remove(id: string): Promise<void> {
    await this.testModel.findByIdAndUpdate(id, { isActive: false }).exec();
  }
}
```

**Controller and Module:**

```typescript
// src/modules/tests/tests.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('tests')
@ApiBearerAuth()
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR)
  create(@Body() createTestDto: any, @CurrentUser() user: any) {
    return this.testsService.create(createTestDto, user.userId);
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.testsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR)
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.testsService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }
}

// src/modules/tests/tests.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { Test, TestSchema } from './schemas/test.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestsController],
  providers: [TestsService],
  exports: [TestsService],
})
export class TestsModule {}
```

---

## STEP 9: CREATE TEST SESSIONS MODULE

### 9.1 Generate Module

```bash
nest g module modules/test-sessions
nest g controller modules/test-sessions
nest g service modules/test-sessions
```

### 9.2 Schema

**`src/modules/test-sessions/schemas/test-session.schema.ts`:**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestSessionDocument = TestSession & Document;

@Schema({ timestamps: true })
export class TestSession {
  @Prop({ unique: true, required: true })
  sessionCode: string;

  @Prop({ type: Types.ObjectId, ref: 'Candidate', required: true })
  candidateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Test', required: true })
  testId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['scheduled', 'in_progress', 'paused', 'completed', 'abandoned'],
    default: 'scheduled',
  })
  status: string;

  @Prop()
  startedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop([{
    questionId: { type: Types.ObjectId },
    selectedAnswer: Schema.Types.Mixed,
    isCorrect: Boolean,
    timeTaken: Number,
    score: Number,
  }])
  answers: Array<any>;

  @Prop({
    type: {
      totalQuestions: Number,
      attempted: Number,
      correct: Number,
      incorrect: Number,
      totalMarks: Number,
      obtainedMarks: Number,
      percentage: Number,
    },
    _id: false,
  })
  score: {
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
  };
}

export const TestSessionSchema = SchemaFactory.createForClass(TestSession);
TestSessionSchema.index({ candidateId: 1 });
TestSessionSchema.index({ testId: 1 });

TestSessionSchema.pre('save', async function (next) {
  if (!this.sessionCode) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.sessionCode = `SES-${timestamp}-${random}`;
  }
  next();
});
```

### 9.3 Service

**`src/modules/test-sessions/test-sessions.service.ts`:**

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestSession, TestSessionDocument } from './schemas/test-session.schema';
import { TestsService } from '../tests/tests.service';

@Injectable()
export class TestSessionsService {
  constructor(
    @InjectModel(TestSession.name) private sessionModel: Model<TestSessionDocument>,
    private testsService: TestsService,
  ) {}

  async create(candidateId: string, testId: string): Promise<TestSession> {
    await this.testsService.findOne(testId);
    const session = new this.sessionModel({
      candidateId,
      testId,
      status: 'scheduled',
    });
    return session.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      this.sessionModel.find().populate('candidateId').populate('testId').skip(skip).limit(limit).exec(),
      this.sessionModel.countDocuments(),
    ]);
    return { sessions, total };
  }

  async findOne(id: string): Promise<TestSession> {
    const session = await this.sessionModel.findById(id).populate('candidateId').populate('testId').exec();
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async start(id: string): Promise<TestSession> {
    const session = await this.findOne(id);
    if (session.status !== 'scheduled') {
      throw new BadRequestException('Session cannot be started');
    }
    session.status = 'in_progress';
    session.startedAt = new Date();
    return session.save();
  }

  async submitAnswer(id: string, questionId: string, answer: any): Promise<TestSession> {
    const session = await this.findOne(id);
    if (session.status !== 'in_progress') {
      throw new BadRequestException('Session not in progress');
    }

    const test = await this.testsService.findOne(session.testId.toString());
    const question = test.questions.find(q => q.questionId.toString() === questionId);
    
    if (!question) throw new NotFoundException('Question not found');

    let isCorrect = false;
    let score = 0;

    if (question.questionType === 'mcq') {
      const correctOption = question.options.find(opt => opt.isCorrect);
      isCorrect = correctOption?.optionText === answer;
      score = isCorrect ? question.marks : 0;
    }

    session.answers.push({
      questionId: question.questionId,
      selectedAnswer: answer,
      isCorrect,
      timeTaken: 0,
      score,
    });

    return session.save();
  }

  async submit(id: string): Promise<TestSession> {
    const session = await this.findOne(id);
    if (session.status === 'completed') {
      throw new BadRequestException('Session already completed');
    }

    const test = await this.testsService.findOne(session.testId.toString());
    const totalQuestions = test.questions.length;
    const attempted = session.answers.length;
    const correct = session.answers.filter(a => a.isCorrect).length;
    const obtainedMarks = session.answers.reduce((sum, a) => sum + a.score, 0);
    const percentage = (obtainedMarks / test.totalMarks) * 100;

    session.score = {
      totalQuestions,
      attempted,
      correct,
      incorrect: attempted - correct,
      totalMarks: test.totalMarks,
      obtainedMarks,
      percentage,
    };

    session.status = 'completed';
    session.completedAt = new Date();
    return session.save();
  }
}
```

### 9.4 Controller and Module

```typescript
// src/modules/test-sessions/test-sessions.controller.ts
import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestSessionsService } from './test-sessions.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
export class TestSessionsController {
  constructor(private readonly sessionsService: TestSessionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR)
  create(@Body() body: { candidateId: string; testId: string }) {
    return this.sessionsService.create(body.candidateId, body.testId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR, UserRole.SUPERVISOR)
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.sessionsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.sessionsService.start(id);
  }

  @Post(':id/answer')
  submitAnswer(
    @Param('id') id: string,
    @Body() body: { questionId: string; answer: any },
  ) {
    return this.sessionsService.submitAnswer(id, body.questionId, body.answer);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string) {
    return this.sessionsService.submit(id);
  }
}

// src/modules/test-sessions/test-sessions.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestSessionsService } from './test-sessions.service';
import { TestSessionsController } from './test-sessions.controller';
import { TestSession, TestSessionSchema } from './schemas/test-session.schema';
import { TestsModule } from '../tests/tests.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TestSession.name, schema: TestSessionSchema }]),
    TestsModule,
  ],
  controllers: [TestSessionsController],
  providers: [TestSessionsService],
  exports: [TestSessionsService],
})
export class TestSessionsModule {}
```

---

## STEP 10: CREATE RESULTS MODULE

### 10.1 Generate Module

```bash
nest g module modules/results
nest g controller modules/results
nest g service modules/results
```

### 10.2 Complete Implementation

**Schema (`src/modules/results/schemas/result.schema.ts`):**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema({ timestamps: true })
export class Result {
  @Prop({ type: Types.ObjectId, ref: 'TestSession', required: true, unique: true })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Candidate', required: true })
  candidateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Test', required: true })
  testId: Types.ObjectId;

  @Prop({ type: String })
  testType: string;

  @Prop({
    type: {
      totalMarks: Number,
      obtainedMarks: Number,
      percentage: Number,
      grade: String,
      passed: Boolean,
    },
    _id: false,
  })
  score: {
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    grade: string;
    passed: boolean;
  };

  @Prop({ default: false })
  isVerified: boolean;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
ResultSchema.index({ candidateId: 1 });
ResultSchema.index({ testId: 1 });
```

**Service, Controller, Module:**

```typescript
// src/modules/results/results.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result, ResultDocument } from './schemas/result.schema';
import { TestSessionsService } from '../test-sessions/test-sessions.service';
import { TestsService } from '../tests/tests.service';

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    private sessionsService: TestSessionsService,
    private testsService: TestsService,
  ) {}

  async generateFromSession(sessionId: string): Promise<Result> {
    const session = await this.sessionsService.findOne(sessionId);
    const test = await this.testsService.findOne(session.testId.toString());

    let grade = 'F';
    const percentage = session.score.percentage;
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const result = new this.resultModel({
      sessionId: session._id,
      candidateId: session.candidateId,
      testId: session.testId,
      testType: test.testType,
      score: {
        totalMarks: session.score.totalMarks,
        obtainedMarks: session.score.obtainedMarks,
        percentage,
        grade,
        passed: percentage >= test.passingScore,
      },
    });

    return result.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.resultModel.find().populate('candidateId').populate('testId').skip(skip).limit(limit).exec(),
      this.resultModel.countDocuments(),
    ]);
    return { results, total };
  }

  async findOne(id: string): Promise<Result> {
    const result = await this.resultModel.findById(id).populate('candidateId').populate('testId').exec();
    if (!result) throw new NotFoundException('Result not found');
    return result;
  }

  async findByCandidate(candidateId: string): Promise<Result[]> {
    return this.resultModel.find({ candidateId }).populate('testId').sort({ createdAt: -1 }).exec();
  }
}

// src/modules/results/results.controller.ts
import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@ApiTags('results')
@ApiBearerAuth()
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post('generate/:sessionId')
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR)
  generate(@Param('sessionId') sessionId: string) {
    return this.resultsService.generateFromSession(sessionId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EVALUATOR, UserRole.SUPERVISOR)
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.resultsService.findAll(page, limit);
  }

  @Get('candidate/:candidateId')
  findByCandidate(@Param('candidateId') candidateId: string) {
    return this.resultsService.findByCandidate(candidateId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }
}

// src/modules/results/results.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { Result, ResultSchema } from './schemas/result.schema';
import { TestSessionsModule } from '../test-sessions/test-sessions.module';
import { TestsModule } from '../tests/tests.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
    TestSessionsModule,
    TestsModule,
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
```

---

## STEP 11: CREATE ANALYTICS MODULE

### 11.1 Generate Module

```bash
nest g module modules/analytics
nest g controller modules/analytics
nest g service modules/analytics
```

### 11.2 Implementation

```typescript
// src/modules/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result, ResultDocument } from '../results/schemas/result.schema';
import { TestSession, TestSessionDocument } from '../test-sessions/schemas/test-session.schema';
import { Candidate, CandidateDocument } from '../candidates/schemas/candidate.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectModel(TestSession.name) private sessionModel: Model<TestSessionDocument>,
    @InjectModel(Candidate.name) private candidateModel: Model<CandidateDocument>,
  ) {}

  async getDashboard() {
    const [totalCandidates, totalSessions, completedSessions, totalResults, passedResults] = await Promise.all([
      this.candidateModel.countDocuments(),
      this.sessionModel.countDocuments(),
      this.sessionModel.countDocuments({ status: 'completed' }),
      this.resultModel.countDocuments(),
      this.resultModel.countDocuments({ 'score.passed': true }),
    ]);

    const passRate = totalResults > 0 ? (passedResults / totalResults) * 100 : 0;

    return {
      totalCandidates,
      totalSessions,
      completedSessions,
      totalResults,
      passRate: Math.round(passRate * 100) / 100,
    };
  }

  async getTestPerformance(testType?: string) {
    const query = testType ? { testType } : {};
    const results = await this.resultModel.find(query).exec();

    if (results.length === 0) {
      return { totalAttempts: 0, averageScore: 0, passRate: 0 };
    }

    const totalAttempts = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.score.percentage, 0) / totalAttempts;
    const passedCount = results.filter(r => r.score.passed).length;
    const passRate = (passedCount / totalAttempts) * 100;

    return {
      totalAttempts,
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
    };
  }
}

// src/modules/analytics/analytics.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@Roles(UserRole.ADMIN, UserRole.EVALUATOR, UserRole.SUPERVISOR)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('test-performance')
  getTestPerformance(@Query('testType') testType?: string) {
    return this.analyticsService.getTestPerformance(testType);
  }
}

// src/modules/analytics/analytics.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Result, ResultSchema } from '../results/schemas/result.schema';
import { TestSession, TestSessionSchema } from '../test-sessions/schemas/test-session.schema';
import { Candidate, CandidateSchema } from '../candidates/schemas/candidate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Result.name, schema: ResultSchema },
      { name: TestSession.name, schema: TestSessionSchema },
      { name: Candidate.name, schema: CandidateSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
```

---

## STEP 12: CREATE REPORTS MODULE

```bash
nest g module modules/reports
nest g controller modules/reports
nest g service modules/reports
```

```typescript
// src/modules/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { ResultsService } from '../results/results.service';
import { CandidatesService } from '../candidates/candidates.service';

@Injectable()
export class ReportsService {
  constructor(
    private resultsService: ResultsService,
    private candidatesService: CandidatesService,
  ) {}

  async generateCandidateReport(candidateId: string) {
    const candidate = await this.candidatesService.findOne(candidateId);
    const results = await this.resultsService.findByCandidate(candidateId);

    const totalTests = results.length;
    const passedTests = results.filter(r => r.score.passed).length;
    const averageScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.score.percentage, 0) / results.length
      : 0;

    return {
      candidate: {
        applicationNumber: candidate.applicationNumber,
        status: candidate.applicationStatus,
      },
      summary: {
        totalTests,
        passedTests,
        averageScore: Math.round(averageScore * 100) / 100,
      },
      testResults: results.map(r => ({
        testType: r.testType,
        score: r.score.percentage,
        passed: r.score.passed,
        grade: r.score.grade,
      })),
    };
  }
}

// src/modules/reports/reports.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@Roles(UserRole.ADMIN, UserRole.EVALUATOR, UserRole.SUPERVISOR)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('candidate/:id')
  generateCandidateReport(@Param('id') id: string) {
    return this.reportsService.generateCandidateReport(id);
  }
}

// src/modules/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ResultsModule } from '../results/results.module';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  imports: [ResultsModule, CandidatesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
```

---

## STEP 13: FINAL STEPS

### 13.1 Create README.md

```markdown
# Loco - Locomotive Pilot Assessment System

Backend API for conducting psychological and cognitive assessments.

## Installation

\`\`\`bash
npm install
\`\`\`

## Running

\`\`\`bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
\`\`\`

## API Documentation

http://localhost:3000/api/docs

## Environment Variables

Copy `.env.example` to `.env` and configure.

## Test Users

- Admin: admin@loco.com / Admin@123
- Evaluator: evaluator@loco.com / Eval@123
```

### 13.2 Run the Application

```bash
# Start MongoDB
mongod

# OR with Docker
docker run -d -p 27017:27017 mongo:7.0

# Start app
npm run start:dev
```

### 13.3 Test API

Visit: http://localhost:3000/api/docs

Test endpoints:
1. POST /api/v1/auth/register
2. POST /api/v1/auth/login
3. GET /api/v1/auth/profile (with Bearer token)

---

## ✅ VERIFICATION CHECKLIST

- [ ] MongoDB running
- [ ] App starts without errors
- [ ] Swagger docs accessible
- [ ] Can register new user
- [ ] Can login and get token
- [ ] Can create candidate
- [ ] Can create test
- [ ] Can create test session
- [ ] Can submit answers
- [ ] Can generate results
- [ ] Analytics dashboard works

---

## 🎉 COMPLETE!

You now have a fully functional Loco Assessment System with:

✅ Authentication & Authorization  
✅ User Management  
✅ Candidate Management  
✅ Test Management  
✅ Test Sessions  
✅ Results & Analytics  
✅ Reports  
✅ API Documentation  
✅ Security Features  

**Ready for production deployment and customization!**