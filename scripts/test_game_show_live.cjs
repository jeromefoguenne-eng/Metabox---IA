const { chromium } = require('playwright');
const path = require('path');

async function testGameShow() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const brainDir = "C:/Users/TrendingPC/.gemini/antigravity/brain/65bbf4ad-fe19-4bd2-8780-ee6d91efae74";

  console.log("Navigating to http://localhost:5173/ ...");
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Passer le générique s'il est présent
  const skipBtn = page.locator('button:has-text("Passer le générique")').first();
  if (await skipBtn.isVisible()) {
    console.log("Skipping generic intro video...");
    await skipBtn.click();
    await page.waitForTimeout(1000);
  }

  // 2. Ouvrir la Tuile 2 (Partie Langagière)
  console.log("Clicking on Tile 2 (Partie Langagière)...");
  const moduleBtns = page.locator('text=Accéder au module');
  await moduleBtns.nth(1).click();
  await page.waitForTimeout(1200);

  // 3. Cliquer sur l'onglet Module 5
  console.log("Clicking on Module 5...");
  const mod5 = page.locator('button:has-text("Module 5")').or(page.locator('text=Module 5')).first();
  if (await mod5.isVisible()) {
    await mod5.click();
    await page.waitForTimeout(1000);
  }

  // 4. Cliquer sur le bouton "Lancer le Jeu TV en Plein Écran"
  console.log("Clicking on 'Lancer le Jeu TV en Plein Écran'...");
  const tvBtn = page.locator('button:has-text("Lancer le Jeu TV")').first();
  if (await tvBtn.isVisible()) {
    await tvBtn.click();
    await page.waitForTimeout(1500);
  }

  // 5. Cliquer sur "COMPRIS AURORE, JE LANCE LA PARTIE !"
  const auroreBtn = page.locator('button:has-text("COMPRIS AURORE")').first();
  if (await auroreBtn.isVisible()) {
    console.log("Clicking 'COMPRIS AURORE, JE LANCE LA PARTIE !'...");
    await auroreBtn.click();
    await page.waitForTimeout(2000);
  }

  // 6. Capturer le Plateau TV en direct
  console.log("Capturing TV Game Show active arena at t=0s...");
  await page.screenshot({ path: path.join(brainDir, "real_tv_gameshow_pixar_animated_t0.png") });

  await page.waitForTimeout(1500);
  console.log("Capturing TV Game Show active arena at t=1.5s...");
  await page.screenshot({ path: path.join(brainDir, "real_tv_gameshow_pixar_animated_t1.png") });

  console.log("Verification finished successfully !");
  await browser.close();
}

testGameShow().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
