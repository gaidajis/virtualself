const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:4173/virtualself/');
  await page.waitForTimeout(3000); // Wait for initialization and graph to settle

  const verificationDir = path.join(process.cwd(), 'verification');
  if (!fs.existsSync(verificationDir)) fs.mkdirSync(verificationDir);

  console.log('Attempting to click "Life Timeline"...');
  try {
    // Attempt to locate and click text "Life Timeline" which is an SVG text element
    await page.locator('text=Life Timeline').first().click({ force: true });
    await page.waitForTimeout(2000); // Wait for panel to open and animations to play
    await page.screenshot({ path: path.join(verificationDir, 'timeline_view.png') });
    console.log('Captured timeline_view.png');

    // Switch to JSON view to see how it looks
    await page.locator('text=JSON View').click({ force: true });
    await page.waitForTimeout(1000);
    // Expand a few things
    await page.locator('text=Life Timeline').first().click({ force: true });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(verificationDir, 'json_expanded_view.png') });
    console.log('Captured json_expanded_view.png');

  } catch (err) {
    console.error('Click error:', err);
  }

  await browser.close();
})();
