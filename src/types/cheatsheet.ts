export type HubId = 'kitchen' | 'crafting' | 'tech' | 'home-health' | 'reference';

export interface CategoryHub {
  id: HubId;
  name: string;
  slug: string;
  path: string; // e.g. '/kitchen/index.html'
  title: string;
  subCategoryCount: number;
  sheetCount: number;
  sheetCountBreakdown: string;
  targetRpm: string;
  audience: string;
  description: string;
  icon: string;
  gradient: string;
  accentColor: string;
}

export interface SubCategory {
  id: string;
  hubId: HubId;
  name: string;
  count: number;
  masterListIds: string;
  keyTopics: string;
}

export interface TableStructure {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
  notes?: string;
}

export interface CheatSheet {
  id: string; // e.g. '#001'
  numId: number; // e.g. 1
  slug: string; // e.g. 'air-fryer-cooking-times'
  title: string;
  h1: string;
  hubId: HubId;
  subCategory: string;
  shortIntro: string;
  pdfStatus: 'available' | 'in_progress';
  pdfDownloadUrl?: string;
  previewImageUrl?: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  imageAlt: string;
  imageFilename: string;
  canonicalUrl: string;
  tableData: TableStructure;
  tags: string[];
  popularRank?: number;
  isRecent?: boolean;
}
