from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto("http://localhost:4173/virtualself/")
    time.sleep(4)

    os.makedirs("verification", exist_ok=True)

    # Try clicking Life Timeline
    print("Clicking Life Timeline")
    page.locator("text=Life Timeline").first.click(force=True)
    time.sleep(2)
    page.screenshot(path="verification/timeline_view.png")

    browser.close()
