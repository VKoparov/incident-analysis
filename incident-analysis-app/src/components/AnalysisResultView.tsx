import type { AnalysisResult } from '../types/report';

interface Props {
  resultStr: string | null;
}

export function AnalysisResultView({ resultStr }: Props) {
  if (!resultStr) return null;
  
  try {
    const result: AnalysisResult = JSON.parse(resultStr);
    return (
      <div className="analysis-result">
        <h3>Analysis Result</h3>
        <p><strong>Summary:</strong> {result.summary}</p>
        <p>
          <strong>Sentiment:</strong>{' '}
          <span className={`sentiment-${result.sentiment.toLowerCase()}`}>
            {result.sentiment}
          </span>
        </p>
        <p>
          <strong>Severity:</strong>{' '}
          <span className={`severity-${result.severity.toLowerCase()}`}>
            {result.severity}
          </span>
        </p>
        <p>
          <strong>Entities:</strong>{' '}
          {result.entities.length > 0 ? result.entities.join(', ') : 'None detected'}
        </p>
        <p>
          <small>Analyzed at: {new Date(result.timestamp).toLocaleString()}</small>
        </p>
      </div>
    );
  } catch (e) {
    return <p>Error parsing result</p>;
  }
}
