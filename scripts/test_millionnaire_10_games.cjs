const { chromium } = require('playwright');

async function testMillionnaire10Games() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') pageErrors.push(msg.text());
  });

  console.log('--- TEST: 10 PARTIES DE QUI VEUT GAGNER DES CRÉDITS ---');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);

  // Passer le grand générique de démarrage
  const skipIntro = await page.$('button:has-text("Passer le générique")');
  if (skipIntro) {
    await skipIntro.click();
    await page.waitForTimeout(600);
  }

  // Ouvrir la Tuile 2
  await page.click('text=Partie Langagière');
  await page.waitForTimeout(600);

  // Lancer le Jeu TV
  const launchBtn = await page.$('button:has-text("Lancer le Jeu TV en Plein Écran")');
  if (!launchBtn) {
    console.error('Bouton de lancement du Jeu TV introuvable !');
    await browser.close();
    return;
  }
  await launchBtn.click();
  await page.waitForTimeout(800);

  // Jouer 10 parties complètes
  for (let game = 1; game <= 10; game++) {
    console.log(`\n▶️ === PARTIE ${game} / 10 ===`);

    // Si le générique TV est affiché, le passer immédiatement
    const skipTvIntro = await page.$('button:has-text("COMMENCER L\'ASCENSION"), button:has-text("Passer le générique")');
    if (skipTvIntro && await skipTvIntro.isVisible()) {
      await skipTvIntro.click();
      await page.waitForTimeout(500);
    }

    // Tester les Jokers sur certaines parties
    if (game === 1 || game === 4 || game === 7) {
      console.log('Utilisation du Joker 50/50...');
      const j50 = await page.$('button:has-text("50/50")');
      if (j50 && !(await j50.isDisabled())) await j50.click();
      await page.waitForTimeout(400);
    }
    if (game === 2 || game === 5) {
      console.log('Utilisation du Joker Public...');
      const jPub = await page.$('button:has-text("Public")');
      if (jPub && !(await jPub.isDisabled())) await jPub.click();
      await page.waitForTimeout(400);
    }
    if (game === 3 || game === 6) {
      console.log('Utilisation du Joker SAR...');
      const jSar = await page.$('button:has-text("SAR")');
      if (jSar && !(await jSar.isDisabled())) await jSar.click();
      await page.waitForTimeout(400);
    }

    let questionsAnswered = 0;
    while (questionsAnswered < 10) {
      await page.waitForTimeout(500);

      // Vérifier si la partie est terminée (Game Over ou Victoire)
      const restartBtn = await page.$('button:has-text("Recommencer la Partie"), button:has-text("Rejouer")');
      if (restartBtn && await restartBtn.isVisible()) {
        console.log(`Partie ${game} terminée après ${questionsAnswered} questions.`);
        break;
      }

      // Chercher les options de réponse (A, B, C, D)
      const options = await page.$$('button:has(span.font-mono.font-black)');
      if (options.length === 0) {
        // Peut-être en attente ou écran de transition
        await page.waitForTimeout(600);
        continue;
      }

      // Choisir une option visible
      let chosenOpt = null;
      for (const opt of options) {
        const isVisible = await opt.isVisible();
        const isDisabled = await opt.isDisabled();
        if (isVisible && !isDisabled) {
          chosenOpt = opt;
          // Dans les parties paires, on choisit exprès une option au hasard pour tester la défaite et le palier
          if (game % 2 === 0 && Math.random() < 0.3) {
            break;
          }
        }
      }

      if (chosenOpt) {
        const optText = (await chosenOpt.innerText()).replace(/\n/g, ' ');
        console.log(`Q${questionsAnswered + 1}: Clic sur [${optText.substring(0, 40)}...]`);
        await chosenOpt.click();
        questionsAnswered++;

        // Attendre le verdict du présentateur (1.8s) + auto-advance ou clic
        await page.waitForTimeout(2500);

        // Si le bouton "Question Suivante" apparaît et qu'on ne veut pas attendre les 5s pleines, on peut cliquer
        const nextBtn = await page.$('button:has-text("Question Suivante")');
        if (nextBtn && await nextBtn.isVisible()) {
          await nextBtn.click();
          await page.waitForTimeout(600);
        }
      } else {
        await page.waitForTimeout(500);
      }
    }

    // Recommencer une nouvelle partie si le bouton restart est là
    await page.waitForTimeout(1000);
    const restartBtn = await page.$('button:has-text("Recommencer la Partie"), button:has-text("Rejouer")');
    if (restartBtn && await restartBtn.isVisible()) {
      console.log('Clic sur Recommencer la Partie...');
      await restartBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  console.log('\n✅ 10 PARTIES DE MILLIONNAIRE TERMINÉES SANS CRASH !');
  console.log('Erreurs de page détectées :', pageErrors.length === 0 ? 'Aucune !' : pageErrors);

  await browser.close();
}

testMillionnaire10Games().catch(e => {
  console.error('Erreur test Millionnaire :', e);
  process.exit(1);
});
