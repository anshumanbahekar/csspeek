import { useState, useRef } from 'react';
import { Link, Code, AlertCircle, Loader2 } from 'lucide-react';
import type { InputMode } from '@/types';

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
<style>
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 60px 40px;
    border-radius: 12px;
  }
  .hero h1 {
    color: #ffffff;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 16px;
  }
  .btn-primary {
    background: #ffffff;
    color: #667eea;
    padding: 12px 28px;
    border-radius: 6px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s ease;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
  }
  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 24px;
    margin-top: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
</style>
</head>
<body>
  <div class="hero">
    <h1>Hello, CSSpeek</h1>
    <button class="btn-primary">Get started</button>
  </div>
  <div class="card">
    <p style="color: #475569; font-size: 0.95rem; line-height: 1.6;">
      This is a sample card with inline styles.
    </p>
  </div>
</body>
</html>`;

interface Props {
  onAnalyze: (html: string, mode: InputMode) => void;
  isLoading: boolean;
  error: string | null;
}

export function InputPanel({ onAnalyze, isLoading, error }: Props) {
  const [mode, setMode] = useState<InputMode>('html');
  const [htmlValue, setHtmlValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (mode === 'html') {
      onAnalyze(htmlValue.trim(), 'html');
    } else {
      onAnalyze(urlValue.trim(), 'url');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const loadSample = () => {
    setHtmlValue(SAMPLE_HTML);
    setMode('html');
    textareaRef.current?.focus();
  };

  const canSubmit =
    !isLoading && (mode === 'html' ? htmlValue.trim().length > 0 : urlValue.trim().length > 0);

  return (
    <div className="input-panel">
      <div className="mode-switcher">
        <button
          className={`mode-btn ${mode === 'html' ? 'active' : ''}`}
          onClick={() => setMode('html')}
        >
          <Code size={15} />
          Paste HTML
        </button>
        <button
          className={`mode-btn ${mode === 'url' ? 'active' : ''}`}
          onClick={() => setMode('url')}
        >
          <Link size={15} />
          Fetch URL
        </button>
      </div>

      {mode === 'html' ? (
        <div className="textarea-wrap">
          <textarea
            ref={textareaRef}
            className="html-input"
            placeholder="Paste your HTML here… (Ctrl+Enter to analyze)"
            value={htmlValue}
            onChange={(e) => setHtmlValue(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
          <button className="sample-btn" onClick={loadSample}>
            Load sample
          </button>
        </div>
      ) : (
        <div className="url-wrap">
          <input
            className="input url-input"
            type="url"
            placeholder="https://example.com"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <p className="url-note">
            Some sites block external requests. If a URL fails, paste the page's HTML directly.
          </p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <button className="btn btn-primary analyze-btn" onClick={handleSubmit} disabled={!canSubmit}>
        {isLoading ? (
          <>
            <Loader2 size={15} className="spin" />
            Fetching…
          </>
        ) : (
          'Analyze CSS'
        )}
      </button>
    </div>
  );
}
