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
