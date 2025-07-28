import { cred, env } from '../support/data';
import { Page, BrowserContext } from 'playwright';
import { PageManager } from './PageObject/pageManager';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const { devBaseUrl } = env;
const { valid_username, valid_surename, valid_referal_code } = cred;

function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) =>
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        })
    );
}

export async function investorManualLogin(page: Page, context: BrowserContext, pm: PageManager): Promise<Page> {
    await page.goto(devBaseUrl);

    // prompt в браузері для вводу email
    const testEmail = await page.evaluate(() => {
        return prompt('Введіть вашу тестову email-адресу:');
    });


    if (!testEmail) throw new Error('Email не введено');

    await pm.loginTo().getInputEmail().fill(testEmail);

    const [popup] = await Promise.all([
        context.waitForEvent('page'),
        pm.loginTo().getLogInButton().click(),
    ]);
    await popup.waitForLoadState();

    const code = await popup.evaluate(() => {
        return prompt('Введіть код з email:');
    });

    if (!code || code.length !== 6) throw new Error('Некоректний код');

    const codeInputs = popup.locator('form.flex >> input[autocomplete="one-time-code"]');

    for (let i = 0; i < code.length; i++) {
        await codeInputs.nth(i).fill(code[i]);
        await popup.waitForTimeout(50);
    }

    await popup.waitForEvent('close');
    await page.waitForURL('**/setupProfile', { timeout: 90000 });

    await pm.loginTo().getReadedCheckbox().click();
    await pm.loginTo().getContinueButton().click();

    await page.waitForTimeout(1000);
    await pm.profile().getFirstNameInput().fill(valid_username);
    await pm.profile().getLastNameInput().fill(valid_surename);
    await pm.profile().getSelectNationality().click();
    await pm.profile().getInputCountryName().fill('Ukr');
    await pm.profile().getUkraineFromList().click();
    //await pm.profile().getInputReferalCode().fill(valid_referal_code)
    await pm.profile().getSubmiteButton().click();
    await page.waitForURL('**/dashboard');

    return page;
}
