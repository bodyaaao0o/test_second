import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch({ headless: false }); // Відкриє реальний браузер
    const context = await browser.newContext();
    const page = await context.newPage();

    // 🔐 Замінити на свій URL логіну
    await page.goto('https://dev.invest.penomo.com/');

    console.log('👉 Увійди в акаунт вручну. Після завершення натисни Enter у терміналі.');

    // ⏸ Пауза поки ти сам не натиснеш Enter у терміналі
    await new Promise<void>((resolve) => {
        process.stdin.resume();
        process.stdin.on('data', () => resolve());
    });

    // ✅ Збереження сесії у файл
    await context.storageState({ path: 'auth/investorPage.json' });

    console.log('✅ Сесію збережено у aauth/investorPage.json');

    await browser.close();
})();
