
export interface OutlineItem {
  index: number;
  title: string;
  focus: string;
  actions: string[];
}

export interface ScriptBlock {
  index: number;
  chapter: string;
  text: string;
  chars: number;
}

export interface SEOResult {
  titles: string[];
  hashtags: string[];
  keywords: string[];
  description: string;
}

export interface LoadingStates {
  outline: boolean;
  seo: boolean;
  script: boolean;
  prompts: boolean;
}
