import type { Report } from '../types/report';
import { AnalysisResultView } from './AnalysisResultView';

interface Props {
  report: Report;
  isPolling?: boolean;
}

export function ReportStatus({ report, isPolling }: Props) {
  return (
    <div className="report-status">
      <div className="status-header">
        <h2>
          Report Status:{' '}
          <span className={`status-${report.status.toLowerCase()}`}>
            {report.status}
          </span>
        </h2>
        {isPolling && <div className="spinner"></div>}
      </div>
      <p><strong>Report ID:</strong> {report.id}</p>
      <p><strong>Submitted:</strong> {new Date(report.createdAt).toLocaleString()}</p>
      <div className="report-text-preview">
        <strong>Original Text:</strong>
        <p>{report.text}</p>
      </div>
      <AnalysisResultView resultStr={report.result} />
    </div>
  );
}
