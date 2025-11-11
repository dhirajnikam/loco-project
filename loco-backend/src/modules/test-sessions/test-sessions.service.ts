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
    const session = await this.sessionModel.findById(id).exec();
    if (!session) throw new NotFoundException('Session not found');
    if (session.status !== 'scheduled') {
      throw new BadRequestException('Session cannot be started');
    }
    session.status = 'in_progress';
    session.startedAt = new Date();
    return session.save();
  }

  async submitAnswer(id: string, questionId: string, answer: any): Promise<TestSession> {
    const session = await this.sessionModel.findById(id).exec();
    if (!session) throw new NotFoundException('Session not found');
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
    const session = await this.sessionModel.findById(id).exec();
    if (!session) throw new NotFoundException('Session not found');
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
