import { formatDistanceToNow } from 'date-fns';
import type { Article } from '../types';

interface ArticleCardProps {
    article: Article;
    onToggleSave: (id: string, currentlySaved: boolean) => void;
}

export function ArticleCard({ article, onToggleSave }: ArticleCardProps) {
    const getSourceBadgeClass = (source: string) => {
        switch (source) {
            case 'reddit':
                return 'badge-reddit';
            case 'ai_rundown':
                return 'badge-rundown';
            case 'bens_bites':
                return 'badge-bens-bites';
            default:
                return '';
        }
    };

    const getSourceDisplayName = (source: string) => {
        switch (source) {
            case 'reddit':
                return 'Reddit';
            case 'ai_rundown':
                return 'AI Rundown';
            case 'bens_bites':
                return "Ben's Bites";
            default:
                return source;
        }
    };

    const timeAgo = formatDistanceToNow(new Date(article.published_date), {
        addSuffix: true,
    });

    // Placeholder gradient if no image
    const placeholderStyle = {
        background: `linear-gradient(135deg, #111 0%, #222 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333'
    };

    return (
        <article className="card fade-in">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="card-image-link">
                <div className="card-image-container" style={!article.image_url ? placeholderStyle : {}}>
                    {article.image_url ? (
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="card-image"
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.style.background = 'linear-gradient(135deg, #111 0%, #222 100%)';
                            }}
                        />
                    ) : (
                        <div className="card-image-placeholder">
                            <span style={{ fontSize: '48px', opacity: 0.1 }}>⚡</span>
                        </div>
                    )}
                </div>
            </a>

            <div className="card-content">
                <div className="flex-between mb-md">
                    <span className={`badge ${getSourceBadgeClass(article.source)}`}>
                        {getSourceDisplayName(article.source)}
                    </span>
                    <button
                        className={`btn-icon btn-ghost ${article.is_saved ? 'saved' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onToggleSave(article.id, article.is_saved);
                        }}
                        aria-label={article.is_saved ? 'Unsave article' : 'Save article'}
                        title={article.is_saved ? 'Unsave article' : 'Save article'}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={article.is_saved ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    </button>
                </div>

                <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <h3 className="card-title">{article.title}</h3>
                </a>

                {article.summary && (
                    <p className="card-description">{article.summary.substring(0, 120)}...</p>
                )}

                <div className="card-meta">
                    {article.author && article.author !== 'Unknown' && (
                        <span className="meta-author">
                            By {article.author}
                        </span>
                    )}
                    <span className="meta-time">
                        {timeAgo}
                    </span>
                </div>

                {article.tags && article.tags.length > 0 && (
                    <div className="card-tags mt-md">
                        {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .card-image-link {
                    display: block;
                    overflow: hidden;
                }
                .card-image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .tag {
                    font-size: 10px;
                    color: var(--color-text-secondary);
                    padding: 2px 6px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 2px;
                    border: 1px solid var(--color-border);
                    text-transform: uppercase;
                }
                .card-meta {
                    margin-top: auto;
                    padding-top: var(--spacing-md);
                    border-top: 1px solid var(--color-border);
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--color-text-secondary);
                }
            `}</style>
        </article>
    );
}
