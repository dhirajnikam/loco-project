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
