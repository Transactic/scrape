import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

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

if __name__ == "__main__":
    print("Welcome to the Web Scraper!")
    start_url = input("Enter the website URL to scrape (e.g., https://example.com): ").strip()
    if not start_url.startswith("http"):
        print("Invalid URL. Please include 'http://' or 'https://'")
    else:
        print(f"Starting to scrape {start_url}...\n")
        scrape(start_url)
        print("\nScraping completed!")
        print(f"Total unique URLs scraped: {len(visited)}")
        print("URLs:")
        for url in visited:
            print(url)
