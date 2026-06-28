export type InputMode = 'html' | 'url';

export interface CSSProperty {
  property: string;
  value: string;
  source?: string;
}

export interface InspectedElement {
  id: string;
  selector: string;
  tag: string;
  classes: string[];
  properties: CSSProperty[];
  computedProperties: CSSProperty[];
}

export interface Snippet {
  id: string;
  name: string;
  selector: string;
  properties: CSSProperty[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type SnippetFilter = 'all' | string;

export interface AppState {
  inputMode: InputMode;
  htmlInput: string;
  urlInput: string;
  isLoading: boolean;
  error: string | null;
  inspectedElements: InspectedElement[];
  selectedElement: InspectedElement | null;
  snippets: Snippet[];
  activeTab: 'inspect' | 'snippets';
}
