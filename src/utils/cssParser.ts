import type { CSSProperty, InspectedElement } from '@/types';

let _elementCounter = 0;

function uid(): string {
  return `el-${++_elementCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Parse inline styles from a style attribute string.
 */
export function parseInlineStyles(styleAttr: string): CSSProperty[] {
  const results: CSSProperty[] = [];
  styleAttr
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((declaration) => {
      const colonIdx = declaration.indexOf(':');
      if (colonIdx === -1) return;
      const property = declaration.slice(0, colonIdx).trim();
      const value = declaration.slice(colonIdx + 1).trim();
      results.push({ property, value, source: 'inline' });
    });
  return results;
}

/**
 * Parse a raw <style> block and extract rules matching a selector.
 */
export function parseStyleBlock(css: string, selector: string): CSSProperty[] {
  const results: CSSProperty[] = [];
  // Simple regex-based approach for embedded <style> tags
  const ruleRegex = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;

  while ((match = ruleRegex.exec(css)) !== null) {
    const ruleSelector = match[1].trim();
    const declarations = match[2].trim();

    // Rough specificity check — does this selector target our element?
    if (selectorMatches(ruleSelector, selector)) {
      const props = parseInlineStyles(declarations.replace(/\n/g, ' '));
      props.forEach((p) => results.push({ ...p, source: ruleSelector }));
    }
  }

  return results;
}

/**
 * Very lightweight selector matcher (tag, class, id, and compound selectors).
 */
function selectorMatches(rule: string, elementSelector: string): boolean {
  const ruleParts = rule
    .split(',')
    .map((r) => r.trim().toLowerCase());
  const target = elementSelector.toLowerCase();

  return ruleParts.some((r) => {
    // Strip pseudo-classes/elements for matching
    const base = r.replace(/::?[\w-]+(\([^)]*\))?/g, '').trim();
    return base === target || target.includes(base) || base.includes(target);
  });
}

/**
 * Walk the DOM tree of a parsed document and extract styled elements.
 */
export function extractElements(doc: Document): InspectedElement[] {
  const elements: InspectedElement[] = [];

  // Gather all <style> blocks in the document
  const styleBlocks = Array.from(doc.querySelectorAll('style'))
    .map((s) => s.textContent ?? '')
    .join('\n');

  const walk = (el: Element) => {
    const tag = el.tagName.toLowerCase();

    // Skip invisible / non-visual tags
    if (['script', 'style', 'meta', 'head', 'link', 'title'].includes(tag)) return;

    const classes = Array.from(el.classList);
    const id = el.id;

    // Build a simple selector string
    const selector = buildSelector(tag, id, classes);

    const inlineStyles = parseInlineStyles(el.getAttribute('style') ?? '');
    const sheetStyles = parseStyleBlock(styleBlocks, selector);

    // Merge — inline wins over sheet
    const merged = mergeProperties([...sheetStyles, ...inlineStyles]);

    elements.push({
      id: uid(),
      selector,
      tag,
      classes,
      properties: merged,
      computedProperties: merged, // In browser context would use getComputedStyle
    });

    Array.from(el.children).forEach(walk);
  };

  Array.from(doc.body?.children ?? []).forEach(walk);
  return elements;
}

function buildSelector(tag: string, id: string, classes: string[]): string {
  let sel = tag;
  if (id) sel += `#${id}`;
  if (classes.length) sel += `.${classes.join('.')}`;
  return sel;
}

function mergeProperties(props: CSSProperty[]): CSSProperty[] {
  const map = new Map<string, CSSProperty>();
  props.forEach((p) => map.set(p.property, p));
  return Array.from(map.values());
}

/**
 * Parse an HTML string and return inspected elements.
 */
export function parseHTML(html: string): InspectedElement[] {
  _elementCounter = 0;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return extractElements(doc);
}

/**
 * Copy a CSS property declaration to the clipboard.
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/**
 * Format an array of CSS properties as a CSS block string.
 */
export function formatCSSBlock(
  selector: string,
  properties: CSSProperty[]
): string {
  if (!properties.length) return `${selector} { }`;
  const decls = properties.map((p) => `  ${p.property}: ${p.value};`).join('\n');
  return `${selector} {\n${decls}\n}`;
}
