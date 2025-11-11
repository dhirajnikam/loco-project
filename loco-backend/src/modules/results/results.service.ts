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
      sessionId: sessionId,
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
