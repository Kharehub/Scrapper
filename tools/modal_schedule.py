import modal
import sys
import os

# Create the Modal App
app = modal.App("ai-news-scraper")

# Create a container image with our dependencies
image = modal.Image.debian_slim().pip_install(
    "requests",
    "beautifulsoup4",
    "supabase",
    "python-dateutil",
    "feedparser",
    "python-dotenv"
)

# Mount the 'tools' directory so our scrapers are available in the container
tools_mount = modal.Mount.from_local_dir("tools", remote_path="/root/tools")

# Define the daily scheduled function
@app.function(
    image=image,
    schedule=modal.Period(days=1), # Run every 24 hours
    mounts=[tools_mount],
    # secrets=[modal.Secret.from_name("supabase-secrets")], # Uncomment when Supabase is ready
    timeout=600 # 10 minutes timeout
)
def run_daily_scrape():
    print("🚀 Starting scheduled daily scrape on Modal...")
    
    # Add /root to python path to allow importing 'tools' modules
    if "/root" not in sys.path:
        sys.path.append("/root")
    
    try:
        # Import run_all dynamically inside the container to avoid local import issues
        from tools import run_all
        run_all.main()
        print("✅ Daily scrape execution finished successfully.")
    except Exception as e:
        print(f"❌ Error during daily scrape: {e}")
        raise e

# Local entrypoint for manual testing: 'modal run tools/modal_schedule.py'
@app.local_entrypoint()
def main():
    print("Triggering manual run of the scraper on Modal...")
    run_daily_scrape.remote()
