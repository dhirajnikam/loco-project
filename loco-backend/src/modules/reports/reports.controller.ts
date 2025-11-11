import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@Roles(UserRole.ADMIN, UserRole.EVALUATOR, UserRole.SUPERVISOR)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('candidate/:id')
  generateCandidateReport(@Param('id') id: string) {
    return this.reportsService.generateCandidateReport(id);
  }
}
