import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
from shared import save_articles

# Header to mimic a browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://google.com'
}

def scrape_rundown():
    logger = logging.getLogger('rundown_scraper')
    url = "https://www.therundown.ai/"
    logger.info(f"Fetching {url}...")
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            logger.error(f"Failed to fetch {url}: {resp.status_code}")
            return

        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # This selector is a guess based on typical structures; maintenance required
        # Look for "Latest Articles" section
        articles_section = None
        for h2 in soup.find_all(['h2', 'div']):
            if "Latest Articles" in h2.get_text():
                articles_section = h2.find_parent('div')
                break
        
        if not articles_section:
            # Fallback: look for generic article cards
            # Common pattern: <a> with href starting with /p/ (newsletter post)
            links = soup.find_all('a', href=True)
            candidate_links = [l for l in links if l['href'].startswith('/p/')]
        else:
            links = articles_section.find_all('a', href=True)
            candidate_links = [l for l in links if l['href'].startswith('/p/')]

        parsed_articles = []
        for link in candidate_links:
            title_tag = link.find(['h3', 'h4', 'div'])
            title = title_tag.get_text().strip() if title_tag else link.get_text().strip()
            
            if not title or len(title) < 10:
                continue

            # Image extraction
            img_tag = link.find('img')
            image_url = img_tag.get('src') if img_tag else None

            full_url = f"https://www.therundown.ai{link['href']}"
            
            # Date is hard to extract from index, let's assume today for latest
            pub_date = datetime.now() 

            article = {
                "source": "ai_rundown",
                "title": title,
                "url": full_url,
                "published_date": pub_date.isoformat(),
                "summary": "Read the full article on The Rundown AI.",
                "author": "The Rundown AI",
                "image_url": image_url,
                "tags": ["AI News"],
                "scraped_at": datetime.now().isoformat()
            }
            parsed_articles.append(article)
            
        # Deduplicate by URL
        unique_articles = {v['url']:v for v in parsed_articles}.values()
        
        logger.info(f"Scraped {len(unique_articles)} articles from The Rundown.")
        if unique_articles:
            save_articles(list(unique_articles), "rundown")
            
    except Exception as e:
        logger.error(f"Error scraping The Rundown: {e}")

if __name__ == "__main__":
    scrape_rundown()
