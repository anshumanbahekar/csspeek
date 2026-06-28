import { useState, useCallback } from 'react';
import { Layers, Bookmark } from 'lucide-react';
import { InputPanel } from '@/components/InputPanel';
import { Inspector } from '@/components/Inspector';
import { SnippetLibrary } from '@/components/SnippetLibrary';
import { useSnippets } from '@/hooks/useSnippets';
import { useUrlFetcher } from '@/hooks/useUrlFetcher';
import { parseHTML } from '@/utils/cssParser';
import type { InspectedElement, InputMode } from '@/types';
import '@/styles/app.css';

type Tab = 'inspect' | 'snippets';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inspect');
  const [elements, setElements] = useState<InspectedElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const { snippets, addSnippet, updateSnippet, deleteSnippet, getAllTags } = useSnippets();
  const { fetchUrl, isLoading } = useUrlFetcher();

  const handleAnalyze = useCallback(
    async (input: string, mode: InputMode) => {
      setError(null);

      if (!input) {
        setError('Please enter some HTML or a URL.');
        return;
      }

      let html = input;

      if (mode === 'url') {
        const result = await fetchUrl(input);
        if (result.error || !result.html) {
          setError(result.error ?? 'Failed to fetch URL.');
          return;
        }
        html = result.html;
      }

      const parsed = parseHTML(html);
      setElements(parsed);
      setHasAnalyzed(true);
      setActiveTab('inspect');

      if (parsed.length === 0) {
        setError('No elements with CSS found. Make sure your HTML has styled elements.');
      }
    },
    [fetchUrl]
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <div className="logo">
            <span className="logo-icon">{'{ }'}</span>
            <span className="logo-text">CSSpeek</span>
          </div>
          <span className="header-tagline">Inspect · Explore · Save</span>
        </div>
        <nav className="header-nav">
          <a
            href="https://github.com/YOUR_USERNAME/csspeek"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main className="main">
        <aside className="sidebar">
          <InputPanel onAnalyze={handleAnalyze} isLoading={isLoading} error={error} />
        </aside>

        <section className="content">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'inspect' ? 'active' : ''}`}
              onClick={() => setActiveTab('inspect')}
            >
              <Layers size={15} />
              Inspector
              {hasAnalyzed && elements.length > 0 && (
                <span className="tab-badge">{elements.length}</span>
              )}
            </button>
            <button
              className={`tab ${activeTab === 'snippets' ? 'active' : ''}`}
              onClick={() => setActiveTab('snippets')}
            >
              <Bookmark size={15} />
              Snippets
              {snippets.length > 0 && (
                <span className="tab-badge">{snippets.length}</span>
              )}
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'inspect' ? (
              hasAnalyzed ? (
                <Inspector elements={elements} onSaveSnippet={addSnippet} />
              ) : (
                <div className="welcome">
                  <div className="welcome-card">
                    <h2>Inspect any CSS in seconds</h2>
                    <ul className="welcome-steps">
                      <li>
                        <span className="step-num">1</span>
                        Paste HTML or enter a URL on the left
                      </li>
                      <li>
                        <span className="step-num">2</span>
                        Hit <strong>Analyze CSS</strong> to extract all styled elements
                      </li>
                      <li>
                        <span className="step-num">3</span>
                        Click any property to copy it · Save selectors as snippets
                      </li>
                    </ul>
                  </div>
                </div>
              )
            ) : (
              <SnippetLibrary
                snippets={snippets}
                allTags={getAllTags()}
                onDelete={deleteSnippet}
                onUpdate={updateSnippet}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
