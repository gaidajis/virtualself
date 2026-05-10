const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  try {
    // Navigate to the local server
    await page.goto('http://localhost:4173/virtualself/');

    // Wait for the app to load
    await page.waitForTimeout(2000);

    // Take a screenshot of the main view
    await page.screenshot({ path: '/home/jules/verification/main_view.png' });

    console.log('Successfully captured screenshot');
  } catch (err) {
    console.error('Failed verification script', err);
  } finally {
    await browser.close();
  }
})();
