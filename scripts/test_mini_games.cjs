const { chromium } = require('playwright');

async function runTests() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push('PAGE_ERROR: ' + err.message);
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);

  // Skip video intro if present
  const skipBtn = await page.$('button:has-text("Passer le générique")');
  if (skipBtn) {
    console.log('Clicking "Passer le générique"...');
    await skipBtn.click();
    await page.waitForTimeout(1000);
  }

  console.log('\n======================================================');
  console.log('TEST 1: QUI VEUT GAGNER DES CRÉDITS (TUILE 2)');
  console.log('======================================================');

  // Click on Tuile 2
  const tuile2 = await page.$('text=Partie Langagière');
  if (tuile2) {
    await tuile2.click();
    await page.waitForTimeout(800);
  } else {
    console.error('Tuile 2 not found on homepage!');
  }

  // Look for "Lancer le Jeu TV en Plein Écran (Qui veut gagner des crédits)"
  const launchTvBtn = await page.$('button:has-text("Qui veut gagner des crédits")');
  if (launchTvBtn) {
    console.log('Found launch button for Qui veut gagner des crédits. Clicking...');
    await launchTvBtn.click();
    await page.waitForTimeout(1500);
  } else {
    // If inside module, check if we need to select module 2 or click on the TV button
    console.log('Searching for TV launch button in modules...');
    const mod2 = await page.$('button:has-text("Module 2")');
    if (mod2) {
      await mod2.click();
      await page.waitForTimeout(600);
    }
    const tvBtn = await page.$('button:has-text("Passer en Émission TV")');
    if (tvBtn) await tvBtn.click();
  }
  await page.waitForTimeout(1000);

  // Take screenshot of Millionnaire arena
  await page.screenshot({ path: 'millionnaire_screen.png' });
  console.log('Millionnaire screen screenshot saved.');

  // Check if intro is displayed in arena
  const passIntroArena = await page.$('button:has-text("Passer le générique"), button:has-text("COMMENCER")');
  if (passIntroArena) {
    console.log('Skipping TV intro...');
    await passIntroArena.click();
    await page.waitForTimeout(1000);
  }

  // Play 10 iterations / questions of Qui veut gagner des crédits
  console.log('Simulating 10 questions of Millionnaire...');
  for (let q = 0; q < 10; q++) {
    console.log(`\n--- Playing question ${q + 1} ---`);
    await page.waitForTimeout(800);

    // Test Jokers on Question 1, 2, 3
    if (q === 0) {
      const joker50 = await page.$('button[title*="50/50"], button:has-text("50/50")');
      if (joker50 && !(await joker50.isDisabled())) {
        console.log('Testing Joker 50/50...');
        await joker50.click();
        await page.waitForTimeout(500);
      }
    }
    if (q === 1) {
      const jokerPub = await page.$('button[title*="Public"], button:has-text("Public")');
      if (jokerPub && !(await jokerPub.isDisabled())) {
        console.log('Testing Joker Public...');
        await jokerPub.click();
        await page.waitForTimeout(500);
      }
    }
    if (q === 2) {
      const jokerSar = await page.$('button[title*="SAR"], button:has-text("SAR")');
      if (jokerSar && !(await jokerSar.isDisabled())) {
        console.log('Testing Joker SAR...');
        await jokerSar.click();
        await page.waitForTimeout(500);
      }
    }

    // Find available answer option buttons (not hidden by 50/50)
    const options = await page.$$('button:has(span.font-mono)');
    console.log(`Found ${options.length} option buttons.`);
    if (options.length > 0) {
      // Pick first non-disabled visible option
      let clicked = false;
      for (const opt of options) {
        const isVisible = await opt.isVisible();
        const isDisabled = await opt.isDisabled();
        if (isVisible && !isDisabled) {
          const text = await opt.innerText();
          console.log('Selecting option:', text.replace(/\n/g, ' '));
          await opt.click();
          clicked = true;
          break;
        }
      }

      // Wait for host verdict and auto-advance
      console.log('Waiting for answer verdict...');
      await page.waitForTimeout(3500);

      // Check dialogue / host feedback
      const hostText = await page.evaluate(() => {
        const el = document.querySelector('.font-lexend.text-slate-200, .font-lexend');
        return el ? el.innerText : '';
      });
      console.log('Host feedback:', hostText.substring(0, 100));

      // Check if game over or next question button appears
      const nextBtn = await page.$('button:has-text("Question Suivante")');
      if (nextBtn && await nextBtn.isVisible()) {
        console.log('Clicking "Question Suivante" or waiting for auto-advance...');
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }

      const restartBtn = await page.$('button:has-text("Recommencer")');
      if (restartBtn && await restartBtn.isVisible()) {
        console.log('Game ended (loss or victory). Restarting for next game...');
        await restartBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  }

  // Close TV game
  const closeTv = await page.$('button[title="Fermer le jeu TV"], button:has(svg.lucide-x)');
  if (closeTv) {
    await closeTv.click();
    await page.waitForTimeout(800);
  }

  console.log('\n======================================================');
  console.log('TEST 2: LE GRAND CONCOURS DE LA HECH (TUILE 5)');
  console.log('======================================================');

  // Go back to dashboard
  const backDash = await page.$('button:has-text("Dashboard"), button:has-text("← Dashboard")');
  if (backDash) {
    await backDash.click();
    await page.waitForTimeout(800);
  }

  // Click on Tuile 5 (Le Métier d'Étudiant.e)
  const tuile5 = await page.$('text=Le Métier d\'Étudiant');
  if (tuile5) {
    await tuile5.click();
    await page.waitForTimeout(800);
  } else {
    console.error('Tuile 5 not found!');
  }

  const launchConcours = await page.$('button:has-text("Le Grand Concours"), button:has-text("Passer en Émission TV")');
  if (launchConcours) {
    console.log('Launching Le Grand Concours...');
    await launchConcours.click();
    await page.waitForTimeout(1500);
  }

  await page.screenshot({ path: 'concours_screen.png' });
  console.log('Grand Concours screenshot saved.');

  // If briefing modal is open, click "ENTRER SUR LE PLATEAU"
  const enterPlateau = await page.$('button:has-text("ENTRER SUR LE PLATEAU"), button:has-text("COMMENCER")');
  if (enterPlateau) {
    console.log('Closing briefing modal...');
    await enterPlateau.click();
    await page.waitForTimeout(1000);
  }

  // Start Manche 1
  const startM1 = await page.$('button:has-text("COMMENCER LA MANCHE 1")');
  if (startM1) {
    console.log('Clicking "COMMENCER LA MANCHE 1"...');
    await startM1.click();
    await page.waitForTimeout(1000);
  }

  // Test Manche 1 buzzer and answering
  console.log('Testing Manche 1 buzzer and response input...');
  for (let round = 0; round < 3; round++) {
    const buzzerBtn = await page.$('button:has-text("BUZZER"), button:has-text("JE SAIS")');
    if (buzzerBtn && await buzzerBtn.isVisible() && !(await buzzerBtn.isDisabled())) {
      console.log('Buzzing in Manche 1...');
      await buzzerBtn.click();
      await page.waitForTimeout(600);

      // Type answer
      const input = await page.$('input[placeholder*="Inscrivez votre réponse"], input[type="text"]');
      if (input && await input.isVisible()) {
        console.log('Entering answer "ECTS"...');
        await input.fill('ECTS');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
      }
    } else {
      console.log('Buzzer not available or opponent buzzed.');
      await page.waitForTimeout(1500);
    }
  }

  console.log('\nConsole Errors captured during test:');
  console.log(consoleErrors.length === 0 ? 'None! Clean run.' : consoleErrors);

  await browser.close();
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
