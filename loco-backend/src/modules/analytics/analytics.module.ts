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
