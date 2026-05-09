from playwright.sync_api import sync_playwright

def test_json_viewer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # We are using Vite preview, so BASE_URL is /virtualself/
            page.goto("http://localhost:4173/virtualself/")

            # Wait for Kyparissis to appear
            page.wait_for_selector('text=Kyparissis')

            # Take screenshot of the complete feature
            page.screenshot(path="/home/jules/verification/verification.png")
            print("Screenshot saved to /home/jules/verification/verification.png")

        except Exception as e:
            print(f"Error occurred: {e}")
            page.screenshot(path="/home/jules/verification/verification_error.png")
            print("Error screenshot saved to /home/jules/verification/verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_json_viewer()
