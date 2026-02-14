import type { SourceFilter, SortOption } from '../types';

interface FiltersProps {
    sourceFilter: SourceFilter;
    sortOption: SortOption;
    showSavedOnly: boolean;
    onSourceChange: (source: SourceFilter) => void;
    onSortChange: (sort: SortOption) => void;
    onToggleSavedOnly: () => void;
    articleCounts: {
        all: number;
        reddit: number;
        ai_rundown: number;
        bens_bites: number;
        saved: number;
    };
}

export function Filters({
    sourceFilter,
    sortOption,
    showSavedOnly,
    onSourceChange,
    onSortChange,
    onToggleSavedOnly,
    articleCounts,
}: FiltersProps) {
    return (
        <div className="filters-container">
            <div className="filters-section">
                <h3 className="filters-title">Filter by Source</h3>
                <div className="filters">
                    <button
                        className={`filter-btn ${sourceFilter === 'all' ? 'active' : ''}`}
                        onClick={() => onSourceChange('all')}
                    >
                        All Sources ({articleCounts.all})
                    </button>
                    <button
                        className={`filter-btn ${sourceFilter === 'reddit' ? 'active' : ''}`}
                        onClick={() => onSourceChange('reddit')}
                    >
                        Reddit ({articleCounts.reddit})
                    </button>
                    <button
                        className={`filter-btn ${sourceFilter === 'ai_rundown' ? 'active' : ''}`}
                        onClick={() => onSourceChange('ai_rundown')}
                    >
                        AI Rundown ({articleCounts.ai_rundown})
                    </button>
                    <button
                        className={`filter-btn ${sourceFilter === 'bens_bites' ? 'active' : ''}`}
                        onClick={() => onSourceChange('bens_bites')}
                    >
                        Ben's Bites ({articleCounts.bens_bites})
                    </button>
                </div>
            </div>

            <div className="filters-section">
                <h3 className="filters-title">Sort & View</h3>
                <div className="filters">
                    <button
                        className={`filter-btn ${sortOption === 'newest' ? 'active' : ''}`}
                        onClick={() => onSortChange('newest')}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ display: 'inline', marginRight: '4px' }}
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                        </svg>
                        Newest First
                    </button>
                    <button
                        className={`filter-btn ${sortOption === 'oldest' ? 'active' : ''}`}
                        onClick={() => onSortChange('oldest')}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ display: 'inline', marginRight: '4px' }}
                        >
                            <line x1="12" y1="19" x2="12" y2="5" />
                            <polyline points="5 12 12 5 19 12" />
                        </svg>
                        Oldest First
                    </button>
                    <button
                        className={`filter-btn ${showSavedOnly ? 'active' : ''}`}
                        onClick={onToggleSavedOnly}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={showSavedOnly ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ display: 'inline', marginRight: '4px' }}
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        Saved Only ({articleCounts.saved})
                    </button>
                </div>
            </div>

            <style>{`
        .filters-container {
          margin-bottom: var(--spacing-xl);
        }

        .filters-section {
          margin-bottom: var(--spacing-lg);
        }

        .filters-title {
          font-size: var(--font-size-small);
          font-weight: 600;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-md);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .filters {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-sm);
          }

          .filter-btn {
            width: 100%;
            font-size: var(--font-size-tiny);
            padding: var(--spacing-sm) var(--spacing-md);
          }
        }
      `}</style>
        </div>
    );
}
