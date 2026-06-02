import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './controller/reports.controller';
import { ReportsService } from './service/reports.service';
import { Report } from './entity/report.entity';
import { AnalysisModule } from '../analysis/analysis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), AnalysisModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
