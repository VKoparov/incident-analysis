import { useEffect, useState, useCallback } from 'react';
import type { Report } from '../types/report';
import { reportsApi } from '../api/reports';
import { ReportStatus } from './ReportStatus';

interface Props {
  id: string;
  onBack: () => void;
}

export function ReportDetail({ id, onBack }: Props) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const fetchReport = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const data = await reportsApi.getOne(id);
      setReport(data);
      if (data.status === 'PENDING' || data.status === 'PROCESSING') {
        setIsPolling(true);
      } else {
        setIsPolling(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  useEffect(() => {
    let interval: number | undefined;
    if (isPolling) {
      interval = window.setInterval(() => {
        fetchReport(true);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, fetchReport]);

  if (loading) return <div>Loading report...</div>;
  if (error) return (
    <div className="error-container">
      <div className="error">{error}</div>
      <button onClick={onBack}>Back to List</button>
    </div>
  );
  if (!report) return <div>Report not found</div>;

  return (
    <div className="report-detail-view">
      <button onClick={onBack} className="back-button">← Back to List</button>
      <ReportStatus report={report} isPolling={isPolling} />
    </div>
  );
}
