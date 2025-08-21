import { test, expect } from '@playwright/test';
import { PageManager } from '../../support/PageObject/pageManager';
import { env, cred } from '../../support/data';
import { LoginImages, checkVisibility } from '../../support/PageObject/loginPage.PO';
import { setGeneratedEmail, getGeneratedEmail } from '../../support/email';
import Mailosaur from 'mailosaur';
import dotenv from 'dotenv';
dotenv.config();


const { stageBaseUrl, devBaseUrl } = env;
const { valid_username,
    valid_surename,
    invalid_userName,
    invalid_sureName,
    invalid_referal_code } = cred;


test.describe("Login as investor", () => {

    let pm: PageManager;
    let images: LoginImages;

    test.beforeEach(async ( {context, page} ) => {
        await context.clearCookies();
        await page.goto(stageBaseUrl);
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });

        pm = new PageManager(page);
        images = new LoginImages(page);
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('Register on investor page', async ({ context, page }, testInfo) => {
        const isMobile = testInfo.project.use.isMobile;

        await page.goto(stageBaseUrl);
        
        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/');
        
        if (!isMobile) {
            await images.checkAllImagesAreVisible();
        }
        
        await expect(pm.loginTo().getLogoImage()).toBeVisible();
        
        await expect(pm.loginTo().getSiteDescription()).toHaveText('Own physical infrastructure that powers the world');
        
        await expect(pm.loginTo().getInputEmail()).toBeVisible();
        
        await expect(pm.loginTo().getLogInButton()).toBeVisible();
        
        await expect(pm.loginTo().getHelpText()).toBeVisible();
        
        await expect(pm.loginTo().getFooter()).toHaveText('© 2025 penomo Ltd.');


        const mailosaur = new Mailosaur(process.env.MAILOSAUR_API_KEY!);
        const serverId = process.env.MAILOSAUR_SERVER_ID!;

        const shortId = Math.random().toString(36).slice(2, 9);
        const testEmail = `${shortId}@${serverId}.mailosaur.net`;
        
        setGeneratedEmail(testEmail);
        
        console.log(getGeneratedEmail())
        
        await pm.loginTo().getInputEmail().fill(testEmail);
        
        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            pm.loginTo().clickOnLogIn(),
        ])
        
        await popup.waitForLoadState();

        const searchCriteria = {
            sentTo: testEmail
        };

        const email = await mailosaur.messages.get(serverId, searchCriteria, { timeout: 20000 });
        let code: string | null = null;

        if (email.subject) {
            const subjectMatch = email.subject.match(/\b(\d{6})\b/);
            if (subjectMatch && subjectMatch[1]) {
                code = subjectMatch[1];
                console.log(`The code: ${code}`);
            }
        }

        if (!code) {
            throw new Error('Verification code not found');
        }


        const codeInputes = popup.locator('form.flex >> input[autocomplete="one-time-code"]');

        for (let i = 0; i < code.length; i++) {
            await codeInputes.nth(i).fill(code[i]);
        
            await popup.waitForTimeout(50);
        }

        await popup.waitForEvent('close');
        
        await page.waitForURL('**/setupProfile', { timeout: 90000 });
        
        await checkVisibility([
            pm.loginTo().getRulesContainer(),
            pm.loginTo().getRulesDescription(),
            pm.loginTo().getReadedCheckbox(),
            pm.loginTo().getContinueButton()
        ])
        await expect(pm.loginTo().getRulesTitle()).toHaveText('Privacy Policy');
        
        await expect(pm.loginTo().getCheckBoxDescription()).toHaveText('I have read and agree to the Privacy Policy');
        
        await expect(pm.loginTo().getContinueButton()).toBeDisabled();
        
        await pm.loginTo().clickOnReadedCheckBox();
        
        await expect(pm.loginTo().getContinueButton()).toBeEnabled();
        
        await pm.loginTo().clickOnContinueButton();
        
        await page.waitForLoadState();
        
        await checkVisibility([
            pm.profile().getProfileInfoBox(),
            pm.profile().getProfileInfoImage(),
            pm.profile().getProfileTitle(),
            pm.profile().getFirstNameInputTitle(),
            pm.profile().getFirstNameInput(),
            pm.profile().getLastNameInputTitle(),
            pm.profile().getLastNameInput(),
            pm.profile().getEmailnfo(),
            pm.profile().getEmailInput(),
            pm.profile().getInvestorType(),
            pm.profile().getSelectInvestorType(),
            pm.profile().getNationalityTitle(),
            pm.profile().getSelectNationality()
        ])
        
        const actualEmail = await pm.profile().getEmailInput().inputValue();
        
        await expect(actualEmail).toEqual(testEmail);
        
        await pm.profile().SelectInvestorType();
        
        await expect(pm.profile().getInvestorTypesAfterSelect()).toBeVisible();
        
        await pm.profile().SelectInvestorType();
        
        await expect(pm.profile().getInvestorTypesAfterSelect()).not.toBeVisible();
        
        await pm.profile().SelectNationality();
        
        await expect(pm.profile().getCountryList()).toBeVisible();
        
        await pm.profile().getInputCountryName().fill('Ukr');
        
        await expect(pm.profile().getUkraineFromList()).toBeVisible();
        
        await pm.profile().clickOnUkraine();
        
        await checkVisibility([
            pm.profile().getReferalCodeTitle(),
            pm.profile().getInputReferalCode(),
            pm.profile().getSubmiteButton()
        ])
        
        await expect(pm.profile().getSubmiteButton()).toBeDisabled();
        
        await pm.profile().getFirstNameInput().fill(invalid_userName);
        
        await expect(pm.profile().getIncorectNameMessage()).toBeVisible();
        
        await pm.profile().getLastNameInput().fill(invalid_sureName);
        
        await expect(pm.profile().getIncorectLastNameMessage()).toBeVisible();
        
        await pm.profile().getFirstNameInput().fill(valid_username);
        
        await pm.profile().getLastNameInput().fill(valid_surename);
        
        await expect(pm.profile().getSubmiteButton()).toBeEnabled();
        
        await pm.profile().getInputReferalCode().fill(invalid_referal_code);
        
        await pm.profile().clickOnSubmitButton();
        
        await expect(pm.profile().getInvalidReferalCodeMessage()).toBeVisible();
        
        await pm.profile().clearInputReferralCode();
        
        await pm.profile().clickOnSubmitButton();

        await checkVisibility([
            pm.loginTo().getTermsAndConditionBox(),
            pm.loginTo().getTermsTitle(),
            pm.loginTo().getTermsDescription(),
            pm.loginTo().getTermsCheckbox(),
            pm.loginTo().getTermsCheckBoxDescription(),
            pm.loginTo().getTermsContinueButton()
        ]);

        await expect(pm.loginTo().getTermsTitle()).toContainText('Terms & Conditions');

        await expect(pm.loginTo().getTermsCheckBoxDescription()).toContainText('I have read and agree to the Terms & Conditions');

        await expect(pm.loginTo().getTermsContinueButton()).toBeDisabled();

        await pm.loginTo().clickOnTermsCheckBox();

        await expect(pm.loginTo().getTermsContinueButton()).toBeEnabled();

        await pm.loginTo().clickOnTermsContinueButton();

        await page.waitForURL('**/dashboard');
        
        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/dashboard');
        
        await page.waitForLoadState();
        
        await context.storageState({ path: 'playwright/.auth/invest_login.json' });
    });

    test("Log in on investor page", async ({ context, page }, testInfo) => {
        
        const isMobile = testInfo.project.use.isMobile;
        
        await page.goto(stageBaseUrl);
        
        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/');
        
        if (!isMobile) {
            await images.checkAllImagesAreVisible();
        }
        
        await expect(pm.loginTo().getLogoImage()).toBeVisible();
        
        await expect(pm.loginTo().getSiteDescription()).toHaveText('Own physical infrastructure that powers the world');
        
        await expect(pm.loginTo().getInputEmail()).toBeVisible();
        
        await expect(pm.loginTo().getLogInButton()).toBeVisible();
        
        await expect(pm.loginTo().getHelpText()).toBeVisible();
        
        await expect(pm.loginTo().getFooter()).toHaveText('© 2025 penomo Foundation Ltd.');
        
        const mailosaur = new Mailosaur(process.env.MAILOSAUR_API_KEY!);
        const serverId = process.env.MAILOSAUR_SERVER_ID!;
        const testEmail = process.env.LOGIN_INVESTOR_SECOND_EMAIL!;
        await pm.loginTo().getInputEmail().fill(testEmail);
        const [popup] = await Promise.all([
            context.waitForEvent('page'),
            pm.loginTo().clickOnLogIn()
        ]);
        await popup.waitForLoadState();

        console.log('Waiting for verification email to arrive...');
        await page.waitForTimeout(5000);

        const now = new Date();

        const receivedAfter = new Date(now.getTime() - 60000);

        const searchOptions = {
            receivedAfter: receivedAfter.toISOString()
        };

        let email;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                email = await mailosaur.messages.get(
                    serverId,
                    {
                        sentTo: testEmail,
                        ...searchOptions
                    },
                    { timeout: 15000 }
                );
                break;
            } catch (error) {
                attempts++;
                console.log(`Attempt ${attempts}/${maxAttempts} failed. Waiting and retrying.`);

                if (attempts >= maxAttempts) {
                    throw new Error(`Failed to get verification email after ${maxAttempts} attempts: ${Error}`);
                }
                await page.waitForTimeout(3000);
            }
        }

        let code: string | null = null;

        if (!email) {
            throw new Error("Email not found");
        };

        if (email.subject) {
            const subjectMatch = email.subject.match(/\b(\d{6})\b/);
            if (subjectMatch && subjectMatch[1]) {
                code = subjectMatch[1];
                console.log(`The code: ${code}`);
            }
        }

        if (!code) {
            throw new Error('Verification code not found');
        }

        const codeInputs = popup.locator('form.flex >> input[autocomplete="one-time-code"]');

        for (let i = 0; i < code.length; i++) {
            await codeInputs.nth(i).fill(code[i]);
        
            await popup.waitForTimeout(50);
        }

        await popup.waitForEvent('close');
        
        await page.waitForURL('**/dashboard');
        
        await page.waitForLoadState();
        
        await context.storageState({ path: 'playwright/.auth/redistered_invest_login.json' })
    });
})