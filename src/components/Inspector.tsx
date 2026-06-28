import { useState, useCallback } from 'react';
import { Copy, Bookmark, ChevronDown, ChevronRight, Tag } from 'lucide-react';
import type { InspectedElement, CSSProperty, Snippet } from '@/types';
import { copyToClipboard, formatCSSBlock } from '@/utils/cssParser';

interface Props {
  elements: InspectedElement[];
  onSaveSnippet: (
    name: string,
    selector: string,
    properties: CSSProperty[],
    tags: string[]
  ) => Snippet;
}

export function Inspector({ elements, onSaveSnippet }: Props) {
  const [selected, setSelected] = useState<InspectedElement | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [snippetName, setSnippetName] = useState('');
  const [snippetTags, setSnippetTags] = useState('');

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleCopyProp = async (prop: CSSProperty) => {
    await copyToClipboard(`${prop.property}: ${prop.value};`);
    setCopied(`${prop.property}`);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleCopyBlock = async () => {
    if (!selected) return;
    await copyToClipboard(formatCSSBlock(selected.selector, selected.properties));
    setCopied('block');
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSave = () => {
    if (!selected) return;
    setSaving(true);
    setSnippetName(selected.selector);
  };

  const handleConfirmSave = () => {
    if (!selected) return;
    const tags = snippetTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    onSaveSnippet(snippetName || selected.selector, selected.selector, selected.properties, tags);
    setSaving(false);
    setSnippetName('');
    setSnippetTags('');
  };

  if (!elements.length) {
    return (
      <div className="inspector-empty">
        <p>No styled elements found. Try adding some HTML with inline styles or a &lt;style&gt; block.</p>
      </div>
    );
  }

  return (
    <div className="inspector">
      <div className="inspector-sidebar">
        <p className="inspector-sidebar-label">
          {elements.length} element{elements.length !== 1 ? 's' : ''} found
        </p>
        <ul className="element-list">
          {elements.map((el) => (
            <li
              key={el.id}
              className={`element-item ${selected?.id === el.id ? 'active' : ''} ${el.properties.length === 0 ? 'no-styles' : ''}`}
              onClick={() => {
                setSelected(el);
                setSaving(false);
              }}
            >
              <span className="element-tag">{el.tag}</span>
              {el.classes.length > 0 && (
                <span className="element-class">.{el.classes.join('.')}</span>
              )}
              {el.properties.length > 0 && (
                <span className="element-prop-count">{el.properties.length}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="inspector-detail">
        {selected ? (
          <>
            <div className="detail-header">
              <div className="detail-selector">
                <code>{selected.selector}</code>
              </div>
              <div className="detail-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleCopyBlock}
                  title="Copy entire CSS block"
                >
                  <Copy size={14} />
                  {copied === 'block' ? 'Copied!' : 'Copy block'}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  title="Save as snippet"
                >
                  <Bookmark size={14} />
                  Save snippet
                </button>
              </div>
            </div>

            {saving && (
              <div className="save-form">
                <input
                  className="input"
                  placeholder="Snippet name"
                  value={snippetName}
                  onChange={(e) => setSnippetName(e.target.value)}
                  autoFocus
                />
                <div className="save-form-row">
                  <div className="input-with-icon">
                    <Tag size={13} />
                    <input
                      className="input"
                      placeholder="Tags (comma-separated)"
                      value={snippetTags}
                      onChange={(e) => setSnippetTags(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={handleConfirmSave}>
                    Save
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSaving(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {selected.properties.length === 0 ? (
              <p className="no-props">No CSS properties found on this element.</p>
            ) : (
              <>
                <div
                  className="prop-group-header"
                  onClick={() => toggleExpand('props')}
                >
                  {expanded.has('props') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Properties ({selected.properties.length})</span>
                </div>
                {(expanded.has('props') || true) && (
                  <table className="prop-table">
                    <tbody>
                      {selected.properties.map((prop, i) => (
                        <tr key={i} className="prop-row" onClick={() => handleCopyProp(prop)}>
                          <td className="prop-name">{prop.property}</td>
                          <td className="prop-value">{prop.value}</td>
                          <td className="prop-copy">
                            {copied === prop.property ? (
                              <span className="copied-label">✓</span>
                            ) : (
                              <Copy size={12} />
                            )}
                          </td>
                          {prop.source && prop.source !== 'inline' && (
                            <td className="prop-source" title={`From: ${prop.source}`}>
                              <span className="source-badge">sheet</span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </>
        ) : (
          <div className="detail-placeholder">
            <p>← Select an element to inspect its styles</p>
          </div>
        )}
      </div>
    </div>
  );
}
