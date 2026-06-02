import { Sentiment } from '../types/sentiment.type';
import { Severity } from '../types/severity.type';

export interface AnalysisResult {
  summary: string;
  sentiment: Sentiment;
  severity: Severity;
  entities: string[];
  timestamp: string;
}
