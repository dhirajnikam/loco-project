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
