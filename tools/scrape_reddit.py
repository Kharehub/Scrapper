import requests
import json
import logging
from datetime import datetime, timedelta
from shared import save_articles

# User Agent is critical for Reddit API
HEADERS = {
    'User-Agent': 'python:ai-news-dashboard:v1.0 (by /u/popm_dev)'
}

SOURCES = [
    "artificial",
    "MachineLearning",
    "singularity"
]

def scrape_reddit():
    logger = logging.getLogger('reddit_scraper')
    # Configure logging if not already configured
    if not logger.handlers:
        logging.basicConfig(level=logging.INFO)
    
    all_articles = []

    for subreddit in SOURCES:
        url = f"https://www.reddit.com/r/{subreddit}/new.json?limit=25"
        logger.info(f"Fetching {url}...")
        
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code != 200:
                logger.error(f"Failed to fetch {subreddit}: {resp.status_code}")
                continue
                
            data = resp.json()
            posts = data.get('data', {}).get('children', [])
            
            for post in posts:
                p_data = post['data']
                
                # Check date (last 24 hours only)
                created_utc = p_data.get('created_utc')
                pub_date = datetime.fromtimestamp(created_utc)
                if datetime.now() - pub_date > timedelta(hours=24):
                    continue
                
                # Image Extraction Logic
                image_url = None
                
                # Check preview first (high res)
                p_preview = p_data.get('preview', {})
                if 'images' in p_preview:
                    images = p_preview['images']
                    if images:
                        image_url = images[0]['source']['url'].replace('&amp;', '&')
                
                # Fallback to thumbnail if valid URL
                if not image_url:
                    thumb = p_data.get('thumbnail')
                    if thumb and thumb.startswith('http'):
                        image_url = thumb

                article = {
                    "source": "reddit",
                    "title": p_data.get('title'),
                    "url": f"https://www.reddit.com{p_data.get('permalink')}",
                    "published_date": pub_date.isoformat(),
                    "summary": p_data.get('selftext', '')[:500] + "..." if p_data.get('selftext') else "",
                    "author": p_data.get('author'),
                    "image_url": image_url,
                    "tags": [subreddit, "reddit"],
                    "scraped_at": datetime.now().isoformat()
                }
                
                all_articles.append(article)
                
        except Exception as e:
            logger.error(f"Error scraping {subreddit}: {e}")

    logger.info(f"Scraped {len(all_articles)} total articles from Reddit.")
    # Deduplicate before saving (by URL)
    unique_articles = list({v['url']:v for v in all_articles}.values())
    if unique_articles:
        save_articles(unique_articles, "reddit")

if __name__ == "__main__":
    scrape_reddit()
