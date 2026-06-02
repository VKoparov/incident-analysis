import { useState, useEffect } from 'react';
import './App.css';
import type { Report } from './types/report';
import { reportsApi } from './api/reports';
import { ReportForm } from './components/ReportForm';
import { ReportStatus } from './components/ReportStatus';
import { ReportList } from './components/ReportList';
import { ReportDetail } from './components/ReportDetail';

type View = 'SUBMIT' | 'LIST' | 'DETAIL';

function App() {
  const [view, setView] = useState<View>('SUBMIT');
  const [report, setReport] = useState<Report | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const fetchReport = async (id: string, isSilent = false) => {
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
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isPolling && report?.id) {
      interval = window.setInterval(() => {
        fetchReport(report.id, true);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, report?.id]);

  const handleSubmit = async (text: string) => {
    setLoading(true);
    setError(null);
    setReport(null);
    setIsPolling(false);

    try {
      const data = await reportsApi.create(text);
      setReport(data);
      setIsPolling(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
    setView('DETAIL');
  };

  const renderContent = () => {
    switch (view) {
      case 'SUBMIT':
        return (
          <>
            <ReportForm
              onSubmit={handleSubmit}
              loading={loading}
              disabled={report?.status === 'PENDING' || report?.status === 'PROCESSING'}
            />
            {error && <div className="error">{error}</div>}
            {report && (
              <ReportStatus
                report={report}
                isPolling={isPolling}
              />
            )}
          </>
        );
      case 'LIST':
        return <ReportList onSelectReport={handleSelectReport} />;
      case 'DETAIL':
        return selectedReportId ? (
          <ReportDetail
            id={selectedReportId}
            onBack={() => setView('LIST')}
          />
        ) : (
          <div className="error">No report selected</div>
        );
      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="container">
      <nav className="main-nav">
        <button
          className={view === 'SUBMIT' ? 'active' : ''}
          onClick={() => { setView('SUBMIT'); setReport(null); setIsPolling(false); }}
        >
          Submit Report
        </button>
        <button
          className={view === 'LIST' || view === 'DETAIL' ? 'active' : ''}
          onClick={() => setView('LIST')}
        >
          View Reports
        </button>
      </nav>

      <h1>Incident Report Analysis</h1>

      {renderContent()}
    </div>
  );
}

export default App;
