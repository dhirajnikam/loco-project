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
