import { useState, useEffect } from 'react';

interface HeaderProps {
    onRefresh: () => void;
    isLoading: boolean;
}

export function Header({ onRefresh, isLoading }: HeaderProps) {
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        setLastUpdated(new Date());
    }, [isLoading]);

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <img
                            src="/logo.png"
                            alt="Popm Logo"
                            className="logo-image"
                            onError={(e) => {
                                // Fallback if logo doesn't load
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <span className="logo-text">AI News Dashboard</span>
                    </div>

                    <div className="header-actions">
                        <button
                            className="btn btn-ghost"
                            onClick={onRefresh}
                            disabled={isLoading}
                            aria-label="Refresh articles"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={isLoading ? 'spinning' : ''}
                            >
                                <polyline points="23 4 23 10 17 10" />
                                <polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Refresh
                        </button>
                        <span className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .last-updated {
          font-size: var(--font-size-tiny);
          color: var(--color-text-secondary);
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .last-updated {
            display: none;
          }
        }
      `}</style>
        </header>
    );
}
