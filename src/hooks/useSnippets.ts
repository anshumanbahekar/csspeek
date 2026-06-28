import { useState, useEffect, useCallback } from 'react';
import type { Snippet, CSSProperty } from '@/types';

const STORAGE_KEY = 'csspeek:snippets';

function loadSnippets(): Snippet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Snippet[]) : [];
  } catch {
    return [];
  }
}

function saveSnippets(snippets: Snippet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>(() => loadSnippets());

  // Persist whenever snippets change
  useEffect(() => {
    saveSnippets(snippets);
  }, [snippets]);

  const addSnippet = useCallback(
    (
      name: string,
      selector: string,
      properties: CSSProperty[],
      tags: string[] = []
    ): Snippet => {
      const now = Date.now();
      const snippet: Snippet = {
        id: `snip-${now}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        selector,
        properties,
        tags,
        createdAt: now,
        updatedAt: now,
      };
      setSnippets((prev) => [snippet, ...prev]);
      return snippet;
    },
    []
  );

  const updateSnippet = useCallback(
    (id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>) => {
      setSnippets((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
        )
      );
    },
    []
  );

  const deleteSnippet = useCallback((id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getAllTags = useCallback((): string[] => {
    const tagSet = new Set<string>();
    snippets.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [snippets]);

  return { snippets, addSnippet, updateSnippet, deleteSnippet, getAllTags };
}
