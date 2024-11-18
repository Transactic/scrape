import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import sys

visited = set()  # To avoid visiting the same URL multiple times

def scrape(url):
    """
    Recursively scrape the given URL for links.
    """
    if url in visited:
        return
    visited.add(url)
    print(f"Scraping: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error accessing {url}: {e}")
        return
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract all links
    for link in soup.find_all('a', href=True):
        full_url = urljoin(url, link['href'])  # Resolve relative URLs
        if full_url.startswith("http") and full_url not in visited:
            scrape(full_url)  # Recursive call

def save_to_downloads(filename, data):
    """
    Save scraped data to the Downloads folder.
    """
    downloads_path = os.path.join(os.path.expanduser("~"), "Downloads")
    filepath = os.path.join(downloads_path, filename)
    with open(filepath, "w", encoding="utf-8") as file:
        file.write(data)
    print(f"Data saved to: {filepath}")

if __name__ == "__main__":
    print("Welcome to the Web Scraper!")
    
    # Prompt user to confirm installation
    confirmation = input("Would you like to proceed with scraping? (y/n): ").strip().lower()
    if confirmation not in ["y", "yes"]:
        print("Installation aborted. Goodbye!")
        sys.exit(0)
    
    # Prompt for the URL to scrape
    start_url = input("Enter the website URL to scrape (e.g., https://example.com): ").strip()
    if not start_url.startswith("http"):
        print("Invalid URL. Please include 'http://' or 'https://'")
        sys.exit(1)
    
    print(f"Starting to scrape {start_url}...\n")
    scrape(start_url)
    
    # Save results to the Downloads folder
    scraped_data = "\n".join(visited)
    save_to_downloads("scraped_data.txt", scraped_data)
    
    print("\nScraping completed!")
    print(f"Total unique URLs scraped: {len(visited)}")
