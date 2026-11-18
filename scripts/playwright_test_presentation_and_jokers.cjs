const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/TrendingPC/.gemini/antigravity/brain/65bbf4ad-fe19-4bd2-8780-ee6d91efae74';

async function run() {
  console.log("🎬 Début du test Playwright : Générique, Présentation & Jokers WWTBAM...");
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

    await page.waitForTimeout(2000);

    // Cliquer sur la Tuile 2 (Le langage des consignes)
    console.log("3. Sélection de la Tuile 2...");
    const tile2 = page.locator('text=Tuile 2').first();
    await tile2.waitFor({ state: 'visible', timeout: 8000 });
    await tile2.click();
    console.log("✅ Tuile 2 ouverte.");

    await page.waitForTimeout(2000);

    // Cliquer sur "🎬 Lancer le Jeu TV en Plein Écran (10 Questions)"
    console.log("4. Recherche du bouton Lancer le Jeu TV...");
    const launchTvBtn = page.locator('button:has-text("Lancer le Jeu TV")').first();
    await launchTvBtn.waitFor({ state: 'visible', timeout: 10000 });
    await launchTvBtn.click();
    console.log("✅ Jeu TV 'Qui Veut Gagner des Crédits' lancé !");

    // Attendre 2 secondes pour que le générique et la présentation se chargent
    await page.waitForTimeout(2500);

    // Capture 1 : Écran de Présentation Officielle WWTBAM avec Henri dans le halo et les règles clés
    const introCapture = path.join(ARTIFACTS_DIR, 'wwtbam_live_01_presentation_card.png');
    await page.screenshot({ path: introCapture, fullPage: false });
    console.log("📸 Capture 1 (Présentation TV par Henri) :", introCapture);

    // Cliquer sur "Lancer la Première Question"
    const startQ1Btn = page.locator('button:has-text("Lancer la Première Question")').first();
    await startQ1Btn.waitFor({ state: 'visible', timeout: 8000 });
    await startQ1Btn.click();
    console.log("5. Clic sur 'Lancer la Première Question'");

    // Attendre 3 secondes : Henri énonce la question avec la bouche en mouvement, puis passe en focus
    await page.waitForTimeout(3000);

    // Capture 2 : Question 1 en cours avec les 4 choix et l'arène sombre
    const q1Capture = path.join(ARTIFACTS_DIR, 'wwtbam_live_02_question_active.png');
    await page.screenshot({ path: q1Capture, fullPage: false });
    console.log("📸 Capture 2 (Question 1 & Pyramide) :", q1Capture);

    // Déclencher le Joker 50/50
    console.log("6. Recherche du Joker 50 / 50...");
    const joker50Btn = page.locator('button:has-text("50 / 50")').first();
    await joker50Btn.waitFor({ state: 'visible', timeout: 8000 });
    await joker50Btn.click();
    console.log("✅ Joker 50 / 50 activé !");

    await page.waitForTimeout(2500);

    // Capture 3 : Joker 50/50 avec 2 choix éliminés et animation Henri
    const joker50Capture = path.join(ARTIFACTS_DIR, 'wwtbam_live_03_joker_5050_applied.png');
    await page.screenshot({ path: joker50Capture, fullPage: false });
    console.log("📸 Capture 3 (Joker 50/50 appliqué) :", joker50Capture);

    // Déclencher le Joker Vote du Public
    const jokerAudienceBtn = page.locator('button:has-text("Public")').first();
    if (await jokerAudienceBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await jokerAudienceBtn.click();
      console.log("7. Joker Vote du Public activé !");
      await page.waitForTimeout(2000);

      const jokerPublicCapture = path.join(ARTIFACTS_DIR, 'wwtbam_live_04_joker_public_poll.png');
      await page.screenshot({ path: jokerPublicCapture, fullPage: false });
      console.log("📸 Capture 4 (Joker Public Sondage) :", jokerPublicCapture);
    }

    // Déclencher le Joker 3 : Appel au SAR
    const jokerSarBtn = page.locator('button:has-text("Appel SAR")').first();
    if (await jokerSarBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await jokerSarBtn.click();
      console.log("8. Joker Appel au SAR activé !");
      await page.waitForTimeout(2500);

      const jokerSarCapture = path.join(ARTIFACTS_DIR, 'wwtbam_live_05_joker_sar_call.png');
      await page.screenshot({ path: jokerSarCapture, fullPage: false });
      console.log("📸 Capture 5 (Joker Appel SAR en ligne) :", jokerSarCapture);
    }

    console.log("🏁 Test Playwright achevé avec succès !");

  } catch (err) {
    console.error("❌ Erreur pendant le test :", err);
  } finally {
    await browser.close();
  }
}

run();
