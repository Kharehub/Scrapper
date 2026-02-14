import logging
import scrape_reddit
import scrape_rundown
# import scrape_bens_bites # placeholder

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scraper.log"),
        logging.StreamHandler()
    ]
)

def main():
    logger = logging.getLogger('orchestrator')
    logger.info("Starting scraper run...")
    
    # Run Reddit Scraper
    try:
        logger.info("Running Reddit Scraper...")
        scrape_reddit.scrape_reddit()
    except Exception as e:
        logger.error(f"Reddit Scraper failed: {e}")

    # Run Rundown Scraper
    try:
        logger.info("Running Rundown AI Scraper...")
        scrape_rundown.scrape_rundown()
    except Exception as e:
        logger.error(f"Rundown AI Scraper failed: {e}")

    # Run Ben's Bites Scraper (TODO)
    # try:
    #     logger.info("Running Ben's Bites Scraper...")
    #     scrape_bens_bites.scrape_bens_bites()
    # except Exception as e:
    #     logger.error(f"Ben's Bites Scraper failed: {e}")

    logger.info("Scraper run complete.")

if __name__ == "__main__":
    main()
