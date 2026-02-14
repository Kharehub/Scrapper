import os
import json
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def get_supabase_client():
    from supabase import create_client
    # Read strict from .env
    url = os.getenv("VITE_SUPABASE_URL")
    key = os.getenv("VITE_SUPABASE_ANON_KEY")
    
    if not url or not key:
        return None
        
    return create_client(url, key)

def save_articles(articles, source_name):
    """
    Saves articles to Supabase if configured, otherwise to a local JSON file.
    """
    logger = logging.getLogger(source_name)
    supabase = get_supabase_client()
    
    if supabase:
        logger.info(f"Supabase configured: {bool(supabase)}")
        try:
            # We must map to the exact Supabase schema
            # id (auto-gen), source, title, url, published_date, summary, author, tags, scraped_at
            
            # Simple transformation to match schema if necessary
            payload = []
            for a in articles:
                # Ensure date is string
                a['published_date'] = a['published_date'].isoformat() if isinstance(a['published_date'], datetime) else a['published_date']
                a['scraped_at'] = datetime.utcnow().isoformat()
                payload.append(a)

            # Insert into 'articles' table
            response = supabase.table('articles').upsert(payload, on_conflict='url').execute()
            logger.info(f"Successfully synced {len(payload)} articles to Supabase.")
            
        except Exception as e:
            logger.error(f"Failed to sync to Supabase: {str(e)}")
            # Fallback to local
            _save_local(articles, source_name)
    else:
        logger.warning("Supabase credentials missing. Saving to local JSON.")
        _save_local(articles, source_name)

def _save_local(articles, source_name):
    logger = logging.getLogger(source_name)
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    filename = f'data/{source_name}_{datetime.now().strftime("%Y%m%d")}.json'
    
    # Read existing if exists to append/dedupe (simple implementation)
    existing = []
    if os.path.exists(filename):
        try:
            with open(filename, 'r') as f:
                existing = json.load(f)
        except:
            pass
            
    # Simple dedupe by URL
    existing_urls = {a['url'] for a in existing}
    new_articles = [a for a in articles if a['url'] not in existing_urls]
    
    final_list = existing + new_articles
    
    with open(filename, 'w') as f:
        json.dump(final_list, f, indent=2, default=str)
        
    logger.info(f"Saved {len(new_articles)} new articles to {filename}")

