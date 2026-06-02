import { Module } from '@nestjs/common';
import { AnalysisService } from './service/analysis.service';

@Module({
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
