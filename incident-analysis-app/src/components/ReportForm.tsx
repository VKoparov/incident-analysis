import { useState } from 'react';

interface Props {
  onSubmit: (text: string) => Promise<void>;
  loading: boolean;
  disabled: boolean;
}

export function ReportForm({ onSubmit, loading, disabled }: Props) {
  const [reportText, setReportText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    await onSubmit(reportText);
    setReportText('');
  };

  return (
    <form onSubmit={handleSubmit} className="report-form">
      <textarea
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        placeholder="Enter incident report details here..."
        rows={6}
        disabled={loading || disabled}
      />
      <button type="submit" disabled={loading || disabled || !reportText.trim()}>
        {loading ? 'Submitting...' : disabled ? 'Processing...' : 'Submit Report'}
      </button>
    </form>
  );
}
