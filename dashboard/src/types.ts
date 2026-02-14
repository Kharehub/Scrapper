// Type definitions for AI News Dashboard

export interface Article {
    id: string;
    source: 'reddit' | 'ai_rundown' | 'bens_bites';
    title: string;
    url: string;
    published_date: string;
    summary?: string;
    author?: string;
    image_url?: string;
    tags: string[];
    is_saved: boolean;
    saved_at?: string;
    created_at: string;
    scraped_at: string;
}

export interface ScrapedArticle {
    source: string;
    title: string;
    url: string;
    published_date: string;
    summary?: string;
    author?: string;
    image_url?: string;
    tags: string[];
    scraped_at: string;
}

export type SourceFilter = 'all' | 'reddit' | 'ai_rundown' | 'bens_bites';
export type SortOption = 'newest' | 'oldest' | 'saved';

export interface FilterState {
    source: SourceFilter;
    sort: SortOption;
    searchQuery: string;
    showSavedOnly: boolean;
}
