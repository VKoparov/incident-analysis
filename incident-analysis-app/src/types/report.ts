export interface AnalysisResult {
  summary: string;
  sentiment: string;
  severity: string;
  entities: string[];
  timestamp: string;
}

export type ReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Report {
  id: string;
  text: string;
  status: ReportStatus;
  result: string | null;
  createdAt: string;
}
