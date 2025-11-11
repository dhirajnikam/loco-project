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
