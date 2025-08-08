import { test, expect, BrowserContext, Page, chromium } from '@playwright/test';
import { PageManager } from '../../support/PageObject/pageManager';
import { env } from '../../support/data';
import { checkVisibility, checkVisibilityWithRetry } from '../../support/PageObject/pageManager';
import { userVerification } from '../../support/make_test_user_verify';
import { Wallet } from 'ethers';
import { investorLogin } from '../../support/login_as_investor';

const wallet = Wallet.createRandom();
console.log('New wallet address:', wallet.address);
const { devBaseUrl, devAdminUrl } = env;

test.describe("E2E: Investor + Admin presale flow", () => {
    let isMobile = false;
    let pm: PageManager
    let investorContext: BrowserContext;
    let investorPage: Page;
    let investorPM: PageManager;

    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminPM: PageManager;

    test.beforeEach(async ({ }, testInfo) => {
        isMobile = testInfo.project.use.isMobile ?? false;
        const browser = await chromium.launch();

        if (isMobile) {
            investorContext = await browser.newContext({
                viewport: { width: 375, height: 667 },
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X)...'
            });
        } else {
            investorContext = await browser.newContext({
                storageState: 'playwright/.auth/invest_login.json'
            });
        }

        investorPage = await investorContext.newPage();
        pm = new PageManager(investorPage);
        investorPM = new PageManager(investorPage);

        if (isMobile) {
            const loggedInPage = await investorLogin(investorPage, investorContext, pm);
            investorPM = new PageManager(loggedInPage);
        } else {
            await investorPage.goto(devBaseUrl);
        }
    });

    test.afterEach(async () => {
        await investorPage.close();
    });

    test("Investor + Admin presale flow", async () => {
        const browser2 = await chromium.launch();

        adminContext = await browser2.newContext({
            storageState: 'playwright/.auth/admin_login.json',
            viewport: { width: 1280, height: 800 }
        });

        adminPage = await adminContext.newPage();
        await adminPage.goto(devAdminUrl);

        pm = new PageManager(adminPage);
        adminPM = new PageManager(adminPage);

        await adminPage.waitForTimeout(15000);

        await adminPM.adminTo().getUsersNavigation().click();
        
        await adminPage.waitForLoadState();
        
        await userVerification(adminPage, adminPM);

        await investorPage.bringToFront();
        
        await investorPage.waitForTimeout(2000);
        
        await investorPage.reload();

        await checkVisibilityWithRetry([
            investorPM.dashboardTo().getWhiteList(),
            investorPM.dashboardTo().getWhiteListLogo(),
            investorPM.dashboardTo().getWhiteListDescription(),
            investorPM.dashboardTo().getWhiteListButton()
        ], 5, 3000, investorPage);

        await investorPM.dashboardTo().getWhiteListButton().click();

        await checkVisibility([
            investorPM.whiteListTo().getGettingWhitelist(),
            investorPM.whiteListTo().getInvestmentAmountTitle(),
            investorPM.whiteListTo().getInvestmentAmountDescription(),
            investorPM.whiteListTo().getInvestmentSum(),
            investorPM.whiteListTo().getNextButton()
        ])

        await investorPM.whiteListTo().getInvestmentSum().fill('2222');
        
        await investorPM.whiteListTo().getNextButton().click();

        await checkVisibility([
            investorPM.whiteListTo().getMetaMaskLogo(),
            investorPM.whiteListTo().getMetaMaskTitle(),
            investorPM.whiteListTo().getMetaMaskDescription(),
            investorPM.whiteListTo().getBitbondLink(),
            investorPM.whiteListTo().getInputWalletAddress(),
            investorPM.whiteListTo().getBackButton(),
            investorPM.whiteListTo().getJoinPNMOCommunityButton()
        ])

        await investorPM.whiteListTo().getInputWalletAddress().fill('asdflkjhasdkjahsdkjashd');
        
        await expect(investorPM.whiteListTo().getInvalidWalletAddressMessage()).toBeVisible();

        await investorPM.whiteListTo().getInputWalletAddress().clear();
        
        await investorPM.whiteListTo().getBackButton().click();
        
        await expect(investorPM.whiteListTo().getGettingWhitelist()).toBeVisible();

        await investorPM.whiteListTo().getNextButton().click();
        
        await investorPM.whiteListTo().getInputWalletAddress().fill(wallet.address);
        
        await investorPM.whiteListTo().getJoinPNMOCommunityButton().click();

        await checkVisibilityWithRetry([
            investorPM.whiteListTo().getSuccessInvite(),
            investorPM.whiteListTo().getSuccessLogo(),
            investorPM.whiteListTo().getSuccessTitle(),
            investorPM.whiteListTo().getSuccessDescription(),
            investorPM.whiteListTo().getPNMOPresalePageButton(),
        ], 5, 3000, investorPage)

        await investorPM.whiteListTo().getPNMOPresalePageButton().click();
        
        await investorPage.waitForLoadState();

        await expect(investorPage).toHaveURL('https://dev.invest.penomo.com/presale');
        
        await expect(investorPM.whiteListTo().getNotificationForInitated()).toBeVisible();
        
        await expect(investorPM.presaleTo().getPresalePageBox()).toBeVisible();

        await adminPage.bringToFront();
        
        await adminPage.reload();
        
        await adminPage.waitForLoadState();

        await checkVisibility([
            adminPM.adminTo().getNavigationBar(),
            adminPM.adminTo().getPresaleNavigation()
        ]);

        await adminPM.adminTo().getPresaleNavigation().click();
        
        await expect(adminPage).toHaveURL('https://dev.admin.penomo.com/presale');

        await checkVisibility([
            adminPM.adminTo().getPresaleBox(),
            adminPM.adminTo().getPresaleNavBar(),
            adminPM.adminTo().getLatestWalletButton()
        ]);

        await expect(adminPM.adminTo().getLatestWalletButton()).toBeVisible();

        await adminPM.adminTo().getLatestWalletButton().click();

        await checkVisibility([
            adminPM.adminTo().getLattestWalletsBox(),
            adminPM.adminTo().getAddedWalletButton(),
            adminPM.adminTo().getCopyWalletButton()
        ]);

        await adminPM.adminTo().getAddedWalletButton().click();

        await checkVisibility([
            adminPM.adminTo().getConfirmWalletAdditionNotify(),
            adminPM.adminTo().getConfirmWalletTitle(),
            adminPM.adminTo().getConfirmWalletDescription(),
            adminPM.adminTo().getWalletAddresses(),
            adminPM.adminTo().getConfirmWalletCancelButton(),
            adminPM.adminTo().getConfirmWalletConfirmButton()
        ])

        await adminPM.adminTo().getConfirmWalletConfirmButton().click();

        await investorPage.bringToFront();
        
        await investorPage.waitForTimeout(5000);

        if (isMobile) {
            await investorPM.dashboardTo().clickOnBurgerMenu();
        };

        await expect(investorPM.presaleTo().getPresalePageNav()).toBeVisible();

        if (isMobile) {
            await investorPM.dashboardTo().clickOnCloseBurgerMenu();
        }

        await investorPage.reload();
        
        await investorPage.waitForLoadState();

        await checkVisibility([
            investorPM.presaleTo().getTermsAndConditionsNotify(),
            investorPM.presaleTo().getConfirmTermsAndConditionsCheckBox(),
            investorPM.presaleTo().getTermsAndConditionsDescription(),
            investorPM.presaleTo().getTermsAndConditionsCancelButton(),
            investorPM.presaleTo().getTermsAndConditionsAgreeAndContinueButton()
        ]);

        await expect(investorPM.presaleTo().getTermsAndConditionsAgreeAndContinueButton()).toBeDisabled();

        await investorPM.presaleTo().getConfirmTermsAndConditionsCheckBox().click();
        
        await expect(investorPM.presaleTo().getTermsAndConditionsAgreeAndContinueButton()).toBeEnabled();

        await investorPM.presaleTo().getTermsAndConditionsAgreeAndContinueButton().click();
        
        await investorPage.waitForLoadState();

        await expect(investorPM.presaleTo().getIFrameForTokens()).toBeVisible();

        await adminPage.bringToFront();

        await checkVisibility([
            adminPM.adminTo().getUsersNavigation(),
        ]);

        await adminPM.adminTo().getUsersNavigation().click();
        
        await adminPage.waitForLoadState();

        await expect(adminPM.adminTo().getUsersList()).toBeVisible();
        
        await expect(adminPM.adminTo().getLastUser()).toBeVisible();

        await adminPM.adminTo().getLastUser().click();

        await checkVisibility([
            adminPM.adminTo().getUserInformationLeft(),
            adminPM.adminTo().getUserInformatiomEditButton()
        ]);

        await adminPM.adminTo().getUserInformatiomEditButton().click();

        await checkVisibility([
            adminPM.adminTo().getEditionUserPage(),
            adminPM.adminTo().getHasPurchasedPRNMO(),
            adminPM.adminTo().getSelectHasPurchasedPRNMO()
        ])

        await adminPM.adminTo().getSelectHasPurchasedPRNMO().selectOption({ value: 'true' });

        await checkVisibility([
            adminPM.adminTo().getPRNMOTransaction(),
            adminPM.adminTo().getPRNMOAmount(),
            adminPM.adminTo().getUSDAmount(),
            adminPM.adminTo().getTransactionHash(),
            adminPM.adminTo().getInputToken(),
            adminPM.adminTo().getInputTransactionHash()
        ])

        await adminPM.adminTo().getInputToken().fill('123321');
        
        await adminPM.adminTo().getInputTransactionHash().fill('0x5bfff430adD6f397C8d0Cae0E28F9cDAD1a256Aa');

        await expect(adminPM.adminTo().getSaveButton()).toBeVisible();
        
        await adminPM.adminTo().getSaveButton().click();

        const notifies = adminPM.adminTo().getSuccessfulyUpdateNotify();
        
        await expect(notifies).toHaveCount(1);
        
        await expect(notifies).toBeVisible();

        await investorPage.bringToFront();


        if (isMobile) {
            await investorPM.dashboardTo().clickOnBurgerMenu();
        }

        await expect(investorPM.dashboardTo().getDashboardNav()).toBeVisible();
        
        await investorPM.dashboardTo().getDashboardNav().click();
        
        await investorPage.waitForLoadState();

        await browser2.close();
    })
})