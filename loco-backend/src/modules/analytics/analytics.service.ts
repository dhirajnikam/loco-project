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
