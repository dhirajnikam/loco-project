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
