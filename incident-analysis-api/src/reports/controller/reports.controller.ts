import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportsService } from '../service/reports.service';
import { Report } from '../entity/report.entity';
import { CreateReportDto } from '../dto/create-report.dto';

@ApiTags('reports')
@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an incident report for analysis' })
  @ApiResponse({
    status: 201,
    description: 'The report has been successfully submitted.',
    type: Report,
  })
  create(@Body() createReportDto: CreateReportDto): Promise<Report> {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incident reports' })
  @ApiResponse({
    status: 200,
    description: 'Return all reports.',
    type: [Report],
  })
  findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report status/result by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the report status and result.',
    type: Report,
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  findOne(@Param('id') id: string): Promise<Report> {
    return this.reportsService.findOne(id);
  }
}
