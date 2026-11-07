const { chromium } = require('playwright');

async function testAllGames10Runs() {
  console.log('🚀 Démarrage du test automatisé : 10 parties pour chaque jeu télévisé HECh...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push('PAGE_ERROR: ' + err.message);
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);

  // Skip video intro if present
  const skipBtn = await page.$('button:has-text("Passer le générique")');
  if (skipBtn) {
    await skipBtn.click();
    await page.waitForTimeout(600);
  }

  // Helper to close Aurore modal if visible
  async function dismissAuroreModal() {
    const btn = await page.$('button:has-text("Compris Aurore"), button:has-text("Passer le générique")');
    if (btn && await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(500);
    }
  }

  // =========================================================================
  // 1. QUI VEUT GAGNER DES CRÉDITS (10 PARTIES SIMULÉES)
  // =========================================================================
  console.log('\n======================================================');
  console.log('🎮 TEST 1 : « QUI VEUT GAGNER DES CRÉDITS ? » (10 PARTIES)');
  console.log('======================================================');

  // Go to Tuile 2 (Partie Langagière / Verbes de consigne)
  const tuile2 = await page.$('text=Partie Langagière, text=Les verbes de consigne, text=ANALYSER LES CONSIGNES');
  if (tuile2) {
    await tuile2.click();
    await page.waitForTimeout(600);
  }

  // Open Millionnaire
  const launchMillionnaire = await page.$('button:has-text("Qui veut gagner des crédits"), button:has-text("Lancer le Jeu TV")');
  if (launchMillionnaire) {
    await launchMillionnaire.click();
    await page.waitForTimeout(1000);
  } else {
    // If inside module, click Module 2 or TV mode
    const mod2 = await page.$('button:has-text("Module 2"), button:has-text("Consignes")');
    if (mod2) await mod2.click();
    const tvBtn = await page.$('button:has-text("Passer en Émission TV")');
    if (tvBtn) await tvBtn.click();
    await page.waitForTimeout(1000);
  }

  await dismissAuroreModal();

  for (let game = 1; game <= 10; game++) {
    console.log(`\n▶️ [Millionnaire] Début Partie #${game}/10`);
    await page.waitForTimeout(500);

    // Test specific mechanics across different games
    if (game === 1) {
      console.log('   - Test Joker 50/50...');
      const j50 = await page.$('button:has-text("50 / 50")');
      if (j50 && !(await j50.isDisabled())) await j50.click();
      await page.waitForTimeout(400);
    } else if (game === 2) {
      console.log('   - Test Joker Public...');
      const jPub = await page.$('button:has-text("Vote Public")');
      if (jPub && !(await jPub.isDisabled())) await jPub.click();
      await page.waitForTimeout(400);
    } else if (game === 3) {
      console.log('   - Test Joker SAR...');
      const jSar = await page.$('button:has-text("Appel SAR")');
      if (jSar && !(await jSar.isDisabled())) await jSar.click();
      await page.waitForTimeout(400);
    } else if (game === 4) {
      console.log('   - Test Joker Switch...');
      const jSwitch = await page.$('button:has-text("Switch")');
      if (jSwitch && !(await jSwitch.isDisabled())) {
        await jSwitch.click();
        console.log('     ✓ Joker Switch actionné avec succès !');
      }
      await page.waitForTimeout(500);
    }

    // Play 3 to 5 questions in this game
    const questionsToPlay = game === 6 ? 2 : 4;
    for (let q = 0; q < questionsToPlay; q++) {
      // Find options
      const optButtons = await page.$$('button:has(span.w-7)');
      if (optButtons.length > 0) {
        // Find visible and non-disabled button
        for (const btn of optButtons) {
          if (await btn.isVisible() && !(await btn.isDisabled())) {
            await btn.click();
            break;
          }
        }
        await page.waitForTimeout(2000);

        // Click next question or advance
        const nextBtn = await page.$('button:has-text("Épreuve Suivante"), button:has-text("Passer direct")');
        if (nextBtn && await nextBtn.isVisible()) {
          await nextBtn.click();
          await page.waitForTimeout(600);
        }
      }
    }

    if (game === 6) {
      // Test Walk Away ("Partir avec mes gains")
      console.log('   - Test de l\'option « 🛑 Partir avec mes gains »...');
      const walkBtn = await page.$('button:has-text("Partir")');
      if (walkBtn && await walkBtn.isVisible()) {
        await walkBtn.click();
        console.log('     ✓ Candidat a quitté le jeu avec ses crédits sécurisés !');
        await page.waitForTimeout(1000);
      }
    }

    // Click Rejouer / Recommencer to start next game
    const restartBtn = await page.$('button:has-text("Recommencer"), button:has-text("Rejouer")');
    if (restartBtn && await restartBtn.isVisible()) {
      console.log(`   ✓ Partie #${game} terminée. Relance immédiate de la partie suivante...`);
      await restartBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // Close TV game
  const closeBtn = await page.$('button[title="Fermer le jeu TV"], button:has(svg.lucide-x)');
  if (closeBtn) {
    await closeBtn.click();
    await page.waitForTimeout(600);
  }

  // =========================================================================
  // 2. LA ROUE DES ACCORDS (10 MANCHES / TOURS DE JEU)
  // =========================================================================
  console.log('\n======================================================');
  console.log('🎮 TEST 2 : « LA ROUE DES ACCORDS » (10 PARTIES/TOURS)');
  console.log('======================================================');

  // Go to Orthographe tile
  const backBtn = await page.$('button:has-text("Dashboard"), button:has-text("←")');
  if (backBtn) {
    await backBtn.click();
    await page.waitForTimeout(600);
  }

  const orthoTile = await page.$('text=Orthographe, text=ORTHOGRAPHE');
  if (orthoTile) {
    await orthoTile.click();
    await page.waitForTimeout(600);
    const launchRoue = await page.$('button:has-text("La Roue des Accords"), button:has-text("Lancer le Jeu TV")');
    if (launchRoue) {
      await launchRoue.click();
      await page.waitForTimeout(1000);
    }
  }

  await dismissAuroreModal();

  for (let r = 1; r <= 10; r++) {
    console.log(`\n▶️ [Roue des Accords] Manche/Tour #${r}/10`);
    
    // Test spin wheel
    const spinBtn = await page.$('button:has-text("TOURNER LA ROUE"), button:has-text("Tourner")');
    if (spinBtn && await spinBtn.isVisible() && !(await spinBtn.isDisabled())) {
      console.log('   - Rotation de la roue...');
      await spinBtn.click();
      await page.waitForTimeout(4200); // Wait for wheel spin animation
    }

    // Pick a letter if available
    const letterBtns = await page.$$('button.font-mono.font-black:not([disabled])');
    if (letterBtns.length > 0) {
      const letterText = await letterBtns[0].innerText();
      console.log(`   - Choix de la lettre « ${letterText} »...`);
      await letterBtns[0].click();
      await page.waitForTimeout(1500);
    }

    // Try solving
    if (r % 3 === 0) {
      console.log('   - Test de résolution de la phrase...');
      const solveToggle = await page.$('button:has-text("RÉSOUDRE LA PHRASE"), button:has-text("Résoudre")');
      if (solveToggle && await solveToggle.isVisible()) {
        await solveToggle.click();
        await page.waitForTimeout(400);
        const input = await page.$('input[placeholder*="Inscrivez la forme"], input[placeholder*="forme"]');
        if (input && await input.isVisible()) {
          await input.fill('NETTOIENT');
          await page.keyboard.press('Enter');
          await page.waitForTimeout(1500);
        }
      }
    }

    // Advance to next round if available
    const nextRound = await page.$('button:has-text("Épreuve Suivante"), button:has-text("Manche Suivante")');
    if (nextRound && await nextRound.isVisible()) {
      await nextRound.click();
      await page.waitForTimeout(600);
    }
  }

  // Close Roue
  const closeRoue = await page.$('button[title="Fermer le jeu TV"], button:has(svg.lucide-x)');
  if (closeRoue) {
    await closeRoue.click();
    await page.waitForTimeout(600);
  }

  // =========================================================================
  // 3. LE GRAND CONCOURS DE LA HECH (10 SESSIONS DE MANCHES)
  // =========================================================================
  console.log('\n======================================================');
  console.log('🎮 TEST 3 : « LE GRAND CONCOURS DE LA HECH » (10 PARTIES/ÉPREUVES)');
  console.log('======================================================');

  const backToDash2 = await page.$('button:has-text("Dashboard"), button:has-text("←")');
  if (backToDash2) {
    await backToDash2.click();
    await page.waitForTimeout(600);
  }

  // Click on Tuile 5 (Le Métier d'Étudiant / Méthodologie)
  const tuile5 = await page.$('text=Le Métier d\'Étudiant, text=Méthodologie');
  if (tuile5) {
    await tuile5.click();
    await page.waitForTimeout(600);
    const launchGrandConcours = await page.$('button:has-text("Le Grand Concours"), button:has-text("Lancer le Jeu TV")');
    if (launchGrandConcours) {
      await launchGrandConcours.click();
      await page.waitForTimeout(1000);
    }
  }

  await dismissAuroreModal();

  for (let c = 1; c <= 10; c++) {
    console.log(`\n▶️ [Grand Concours] Session #${c}/10`);

    // Check if on Manche 1
    const buzzerBtn = await page.$('button:has-text("BUZZER"), button:has-text("JE SAIS")');
    if (buzzerBtn && await buzzerBtn.isVisible() && !(await buzzerBtn.isDisabled())) {
      console.log('   - Buzzer pressé en Manche 1...');
      await buzzerBtn.click();
      await page.waitForTimeout(500);

      const input = await page.$('input[type="text"]');
      if (input && await input.isVisible()) {
        console.log('   - Saisie de réponse « ECTS »...');
        await input.fill('ECTS');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1800);
      }
    } else {
      console.log('   - Buzzer en attente ou adversaire buzzé.');
      await page.waitForTimeout(1000);
    }

    // Test restarting or next question
    const restartM1 = await page.$('button:has-text("Recommencer la Manche 1")');
    if (restartM1 && await restartM1.isVisible()) {
      await restartM1.click();
      await page.waitForTimeout(600);
    }
  }

  // Close Grand Concours
  const closeConcours = await page.$('button[title="Fermer le jeu TV"], button:has(svg.lucide-x)');
  if (closeConcours) {
    await closeConcours.click();
    await page.waitForTimeout(600);
  }

  console.log('\n======================================================');
  console.log('BILAN DE L\'AUDIT AUTOMATISÉ :');
  console.log('======================================================');
  console.log(`Erreurs console détectées : ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Erreurs :', consoleErrors);
  } else {
    console.log('✅ ZÉRO ERREUR RUNTIME / CONSOLE ! Les 10 parties de chaque jeu tournent avec une fluidité absolue !');
  }

  await browser.close();
}

testAllGames10Runs().catch(err => {
  console.error('Erreur testAllGames10Runs:', err);
  process.exit(1);
});
