import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../entity/report.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import { AnalysisService } from '../../analysis/service/analysis.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    private analysisService: AnalysisService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportsRepository.create({
      text: createReportDto.text,
      status: ReportStatus.PENDING,
    });
    const savedReport = await this.reportsRepository.save(report);

    // Trigger asynchronous analysis
    this.analyzeReport(savedReport.id);

    return savedReport;
  }

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportsRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }
    return report;
  }

  private async analyzeReport(id: string): Promise<void> {
    // Simulate background processing
    setTimeout(async () => {
      try {
        const report = await this.reportsRepository.findOneBy({ id });
        if (!report) return;

        // Update to PROCESSING
        report.status = ReportStatus.PROCESSING;
        await this.reportsRepository.save(report);

        // Simulate analysis delay
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Perform rule-based analysis using the injected AnalysisService
        const analysisResult = this.analysisService.performAnalysis(
          report.text,
        );

        report.status = ReportStatus.COMPLETED;
        report.result = JSON.stringify(analysisResult);
        await this.reportsRepository.save(report);

        this.logger.log(`Report ${id} analysis completed`);
      } catch (error) {
        this.logger.error(`Error analyzing report ${id}: ${error.message}`);
        const report = await this.reportsRepository.findOneBy({ id });
        if (report) {
          report.status = ReportStatus.FAILED;
          await this.reportsRepository.save(report);
        }
      }
    }, 1000); // Small initial delay before starting "processing"
  }
}
