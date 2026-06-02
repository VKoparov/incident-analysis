import { useEffect, useState } from 'react';
import type { Report } from '../types/report';
import { reportsApi } from '../api/reports';

interface Props {
  onSelectReport: (id: string) => void;
}

export function ReportList({ onSelectReport }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportsApi.getAll();
        setReports(data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="report-list-view">
      <h2>All Incident Reports</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id.substring(0, 8)}...</td>
                <td>
                  <span className={`status-${report.status.toLowerCase()}`}>
                    {report.status}
                  </span>
                </td>
                <td>{new Date(report.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => onSelectReport(report.id)}
                    className="view-button"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
