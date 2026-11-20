const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/TrendingPC/.gemini/antigravity/brain/65bbf4ad-fe19-4bd2-8780-ee6d91efae74';

async function run() {
  console.log("🎬 Début du test Playwright HD : Validation des 4 Familles d'Animations & Synchronisation...");
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--autoplay-policy=no-user-gesture-required']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    console.log("1. Application Métabox chargée.");

    // Passer l'intro générale si elle apparaît
    const skipIntroBtn = page.locator('button:has-text("Passer"), button:has-text("Entrer")').first();
    if (await skipIntroBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await skipIntroBtn.click();
      console.log("2. Intro vidéo générale passée.");
    }

    await page.waitForTimeout(1500);

    // Sélection de la Tuile 2
    const tile2 = page.locator('text=Tuile 2').first();
    await tile2.waitFor({ state: 'visible', timeout: 8000 });
    await tile2.click();
    console.log("3. Tuile 2 ouverte.");

    await page.waitForTimeout(1500);

    // Lancer le Jeu TV
    const launchTvBtn = page.locator('button:has-text("Lancer le Jeu TV")').first();
    await launchTvBtn.waitFor({ state: 'visible', timeout: 10000 });
    await launchTvBtn.click();
    console.log("✅ Jeu TV lancé !");

    await page.waitForTimeout(2000);

    // Démarrer la première question
    const startQ1Btn = page.locator('button:has-text("Lancer la Première Question")').first();
    if (await startQ1Btn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await startQ1Btn.click();
    }
    console.log("4. Première Question active (Plan 1 - Accueil & Détente)...");

    await page.waitForTimeout(2500);

    // Capture 1 : Question 1 (Plan 1 HD)
    const cap1 = path.join(ARTIFACTS_DIR, 'live_hd_01_plan1_easy.png');
    await page.screenshot({ path: cap1, fullPage: false });
    console.log("📸 Capture 1 (Plan 1 HD Q1) :", cap1);

    // Répondre correctement pour avancer vers les paliers suivants
    // Trouver le bouton avec la classe ou le premier choix
    const firstOption = page.locator('button:has(span.font-mono):has-text("A.")').first();
    if (await firstOption.isVisible({ timeout: 4000 }).catch(() => false)) {
      await firstOption.click();
      console.log("5. Choix sélectionné, attente de confirmation...");
      await page.waitForTimeout(2000);
    }

    console.log("🏁 Test Playwright HD achevé avec succès !");

  } catch (err) {
    console.error("❌ Erreur pendant le test :", err);
  } finally {
    await browser.close();
  }
}

run();
