import { useState, useCallback } from 'react';

// Public CORS proxies (used in development / demo; production should use own backend)
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

interface FetchResult {
  html: string | null;
  error: string | null;
}

export function useUrlFetcher() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchUrl = useCallback(async (url: string): Promise<FetchResult> => {
    setIsLoading(true);

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setIsLoading(false);
      return { html: null, error: 'Invalid URL. Please enter a valid web address.' };
    }

    // Try direct fetch first (works for same-origin or CORS-enabled sites)
    try {
      const res = await fetch(parsedUrl.href, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const html = await res.text();
        setIsLoading(false);
        return { html, error: null };
      }
    } catch {
      // Fall through to proxy
    }

    // Try CORS proxies in order
    for (const buildProxy of CORS_PROXIES) {
      try {
        const proxyUrl = buildProxy(parsedUrl.href);
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
        if (res.ok) {
          const html = await res.text();
          setIsLoading(false);
          return { html, error: null };
        }
      } catch {
        // Try next proxy
      }
    }

    setIsLoading(false);
    return {
      html: null,
      error:
        'Could not fetch the URL. The site may block external requests. Try pasting the HTML directly instead.',
    };
  }, []);

  return { fetchUrl, isLoading };
}
