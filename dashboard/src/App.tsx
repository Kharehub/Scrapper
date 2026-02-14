import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { ArticleCard } from './components/ArticleCard';
import { articleService } from './supabase';
import { mockArticles } from './mockData';
import type { Article, SourceFilter, SortOption } from './types';
import './index.css';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [useMockData, setUseMockData] = useState(!isSupabaseConfigured());

  // Fetch articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Apply filters whenever articles or filter state changes
  useEffect(() => {
    applyFilters();
  }, [articles, sourceFilter, sortOption, showSavedOnly]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      if (useMockData) {
        // Use mock data for demo
        setTimeout(() => {
          setArticles(mockArticles);
          setIsLoading(false);
        }, 500);
      } else {
        const data = await articleService.getRecentArticles();
        setArticles(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      // Fallback to mock data on error
      setUseMockData(true);
      setArticles(mockArticles);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...articles];

    // Filter by source
    if (sourceFilter !== 'all') {
      filtered = filtered.filter((article) => article.source === sourceFilter);
    }

    // Filter by saved status
    if (showSavedOnly) {
      filtered = filtered.filter((article) => article.is_saved);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_date).getTime();
      const dateB = new Date(b.published_date).getTime();

      if (sortOption === 'newest') {
        return dateB - dateA;
      } else if (sortOption === 'oldest') {
        return dateA - dateB;
      } else if (sortOption === 'saved') {
        if (a.is_saved && !b.is_saved) return -1;
        if (!a.is_saved && b.is_saved) return 1;
        return dateB - dateA;
      }
      return 0;
    });

    setFilteredArticles(filtered);
  };

  const handleToggleSave = async (articleId: string, currentlySaved: boolean) => {
    if (useMockData) {
      // Update local state for mock data
      setArticles((prev) =>
        prev.map((article) =>
          article.id === articleId
            ? {
              ...article,
              is_saved: !currentlySaved,
              saved_at: !currentlySaved ? new Date().toISOString() : undefined,
            }
            : article
        )
      );
    } else {
      // Use Supabase for real data
      const success = await articleService.toggleSave(articleId, currentlySaved);

      if (success) {
        setArticles((prev) =>
          prev.map((article) =>
            article.id === articleId
              ? {
                ...article,
                is_saved: !currentlySaved,
                saved_at: !currentlySaved ? new Date().toISOString() : undefined,
              }
              : article
          )
        );
      }
    }
  };

  const getArticleCounts = () => {
    return {
      all: articles.length,
      reddit: articles.filter((a) => a.source === 'reddit').length,
      ai_rundown: articles.filter((a) => a.source === 'ai_rundown').length,
      bens_bites: articles.filter((a) => a.source === 'bens_bites').length,
      saved: articles.filter((a) => a.is_saved).length,
    };
  };

  return (
    <div className="app">
      <Header onRefresh={fetchArticles} isLoading={isLoading} />

      <main className="container section">
        <div className="hero-section">
          <h1 className="hero-title">
            Latest AI News
            <span className="text-primary">.</span>
          </h1>
          <p className="hero-subtitle">
            Aggregated from Reddit, AI Rundown, and Ben's Bites • Updated every 24 hours
          </p>
        </div>

        {useMockData && (
          <div className="demo-banner">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              <strong>Demo Mode:</strong> Using mock data. Configure Supabase credentials in <code>.env</code> to connect to your database.
            </span>
          </div>
        )}

        <Filters
          sourceFilter={sourceFilter}
          sortOption={sortOption}
          showSavedOnly={showSavedOnly}
          onSourceChange={setSourceFilter}
          onSortChange={setSortOption}
          onToggleSavedOnly={() => setShowSavedOnly(!showSavedOnly)}
          articleCounts={getArticleCounts()}
        />

        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className="text-secondary">Loading latest AI news...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h2>No articles found</h2>
            <p>
              {showSavedOnly
                ? "You haven't saved any articles yet."
                : 'No articles match your current filters.'}
            </p>
            {showSavedOnly && (
              <button
                className="btn btn-primary mt-lg"
                onClick={() => setShowSavedOnly(false)}
              >
                View All Articles
              </button>
            )}
          </div>
        ) : (
          <div className="articles-grid grid grid-3">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p className="text-center text-secondary">
            Built with <span className="text-primary">♥</span> using Popm brand guidelines
          </p>
        </div>
      </footer>

      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        main {
          flex: 1;
        }

        .hero-section {
          text-align: center;
          margin-bottom: var(--spacing-3xl);
          padding: var(--spacing-2xl) 0;
        }

        .hero-title {
          font-size: clamp(48px, 8vw, 72px);
          font-weight: 900;
          margin-bottom: var(--spacing-md);
          background: linear-gradient(135deg, #FFFFFF, var(--color-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: var(--font-size-small);
          color: var(--color-text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .articles-grid {
          animation: fadeIn 0.5s ease-out;
        }

        .footer {
          padding: var(--spacing-xl) 0;
          border-top: 1px solid var(--color-border);
          margin-top: var(--spacing-3xl);
        }

        .demo-banner {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          background: rgba(191, 245, 73, 0.1);
          border: 1px solid var(--color-primary);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-xl);
          color: var(--color-text-primary);
          font-size: var(--font-size-small);
        }

        .demo-banner code {
          background: var(--color-surface-dark);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-family: 'Courier New', monospace;
          color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: var(--spacing-lg) 0;
            margin-bottom: var(--spacing-xl);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
