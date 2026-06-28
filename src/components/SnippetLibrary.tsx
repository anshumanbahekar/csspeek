import { useState, useCallback } from 'react';
import { Copy, Trash2, Tag, Search, BookmarkX } from 'lucide-react';
import type { Snippet } from '@/types';
import { copyToClipboard, formatCSSBlock } from '@/utils/cssParser';

interface Props {
  snippets: Snippet[];
  allTags: string[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>) => void;
}

export function SnippetLibrary({ snippets, allTags, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCopy = useCallback(async (snippet: Snippet) => {
    const block = formatCSSBlock(snippet.selector, snippet.properties);
    await copyToClipboard(block);
    setCopied(snippet.id);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (confirmDelete === id) {
        onDelete(id);
        setConfirmDelete(null);
      } else {
        setConfirmDelete(id);
        setTimeout(() => setConfirmDelete(null), 2500);
      }
    },
    [confirmDelete, onDelete]
  );

  const filtered = snippets.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.selector.toLowerCase().includes(q) ||
      s.tags.some((t) => t.includes(q));
    const matchTag = !activeTag || s.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  if (snippets.length === 0) {
    return (
      <div className="snippets-empty">
        <BookmarkX className="snippets-empty-icon" size={32} />
        <p>No snippets yet.</p>
        <p className="snippets-empty-sub">
          Inspect an element and hit <strong>Save snippet</strong> to store CSS you want to reuse.
        </p>
      </div>
    );
  }

  return (
    <div className="snippet-library">
      <div className="snippet-toolbar">
        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <input
            className="input search-input"
            placeholder="Search snippets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {allTags.length > 0 && (
          <div className="tag-filters">
            <button
              className={`tag-pill ${activeTag === null ? 'active' : ''}`}
              onClick={() => setActiveTag(null)}
            >
              All
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                className={`tag-pill ${activeTag === t ? 'active' : ''}`}
                onClick={() => setActiveTag(activeTag === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="no-results">No snippets match your search.</p>
      ) : (
        <div className="snippet-grid">
          {filtered.map((snippet) => (
            <div key={snippet.id} className="snippet-card">
              <div className="snippet-card-header">
                <div>
                  <p className="snippet-name">{snippet.name}</p>
                  <code className="snippet-selector">{snippet.selector}</code>
                </div>
                <div className="snippet-actions">
                  <button
                    className="btn btn-ghost btn-icon"
                    title="Copy CSS block"
                    onClick={() => handleCopy(snippet)}
                  >
                    {copied === snippet.id ? (
                      <span className="copied-label">✓</span>
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <button
                    className={`btn btn-icon ${confirmDelete === snippet.id ? 'btn-danger' : 'btn-ghost'}`}
                    title={confirmDelete === snippet.id ? 'Click again to confirm' : 'Delete snippet'}
                    onClick={() => handleDelete(snippet.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="snippet-props">
                {snippet.properties.slice(0, 6).map((p, i) => (
                  <div key={i} className="snippet-prop">
                    <span className="prop-name">{p.property}</span>
                    <span className="prop-value">{p.value}</span>
                  </div>
                ))}
                {snippet.properties.length > 6 && (
                  <p className="snippet-more">+{snippet.properties.length - 6} more</p>
                )}
              </div>

              {snippet.tags.length > 0 && (
                <div className="snippet-tags">
                  <Tag size={11} />
                  {snippet.tags.map((t) => (
                    <span key={t} className="tag-badge">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
