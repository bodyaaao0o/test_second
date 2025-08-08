import { test, expect } from '@playwright/test';
import { PageManager } from '../../support/PageObject/pageManager';
import { env, cred } from '../../support/data';
import { checkVisibility } from '../../support/PageObject/pageManager';

const {change_username, change_surename,} = cred;
const { devBaseUrl } = env;

test.use({ storageState: 'playwright/.auth/redistered_invest_login.json' });

test.describe("E2E test for investor portal", () => {
    let pm: PageManager;
    

    test("Investor test flow", async({ page }, testInfo) => {
        const isMobile = testInfo.project.use.isMobile;
        pm  = new PageManager(page);

        await page.goto(devBaseUrl);

        await expect(page).toHaveURL("https://dev.invest.penomo.com/dashboard");

        await checkVisibility([
            pm.dashboardTo().getPNMORewardsBox(),
            pm.dashboardTo().getPNMORewardsInfo(),
            pm.dashboardTo().getPNMORewardsLogo(),
            pm.dashboardTo().getPNMORewardsTitle(),
            pm.dashboardTo().getCountPNMOTokens(),
            pm.dashboardTo().getCountXP(),
            pm.dashboardTo().getEarnButton(),
            pm.dashboardTo().getClaimButton(),
            pm.dashboardTo().getRecentTransactionsBox(),
            pm.dashboardTo().getViewAllTransactionsButton(),
            pm.dashboardTo().getNotification(),
            pm.dashboardTo().getWalletBalanceBox(),
            pm.dashboardTo().getWalletIcon(),
            pm.dashboardTo().getWalletBalanceTitle(),
            pm.dashboardTo().getTopUpButton(),
            pm.dashboardTo().getWithdrawButton()
        ])

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        }

        await checkVisibility([
            pm.dashboardTo().getDashboardNav(),
            pm.dashboardTo().getPNMOPresaleRound2Nav(),
            pm.dashboardTo().getInvestNav(),
            pm.dashboardTo().getCampaignsNav(),
            pm.dashboardTo().getPortfolioNav(),
            pm.dashboardTo().getTransactionsNav(),
            pm.dashboardTo().getStakingNav(),
            pm.dashboardTo().getGovernanceNav(),
            pm.dashboardTo().getSettingsNav(),
        ]);

        if (isMobile) {
            await pm.dashboardTo().clickOnCloseBurgerMenu();
        };
        
        await pm.dashboardTo().getViewAllTransactionsButton().click();
        
        await expect(page).toHaveURL('https://dev.invest.penomo.com/transactions');
        
        await page.goBack();

        if(isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };
        
        await pm.dashboardTo().getPNMOPresaleRound2Nav().click();
        
        await expect(page).toHaveURL('https://dev.invest.penomo.com/presale');

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };
        
        await pm.dashboardTo().getInvestNav().click();
        
        //Marketplace

        await expect(page).toHaveURL('https://dev.invest.penomo.com/marketplace');

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };

        await pm.dashboardTo().getCampaignsNav().click();
        
        //Campaigns
        
        await expect(page).toHaveURL('https://dev.invest.penomo.com/campaigns?section=referral');

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };
        
        await pm.dashboardTo().getPortfolioNav().click();
        
        //Portfolio
        
        await expect(page).toHaveURL('https://dev.invest.penomo.com/portfolio');

        await checkVisibility([
            pm.portfolioTo().getTotalInvested(),
            pm.portfolioTo().getUSDCountInvested(),
            pm.portfolioTo().getTotalYield(),
            pm.portfolioTo().getUSDCountYield(),
            pm.portfolioTo().getRWATokenHoldingsTitle(),
            pm.portfolioTo().getSearchFiled(),
            pm.portfolioTo().getPurchaseRequestsButton(),
            pm.portfolioTo().getHoldingsButton(),
            pm.portfolioTo().getNoTokenHoldings()
        ]);
        
        await pm.portfolioTo().getPurchaseRequestsButton().click();
        
        await expect(pm.portfolioTo().getNoPurchasingRequestsText()).toBeVisible();
        
        await pm.portfolioTo().getSearchFiled().fill('testdata');
        
        await pm.portfolioTo().getSearchFiled().clear();

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };
        
        await pm.dashboardTo().getTransactionsNav().click();
        
        //Transactions

        await expect(page).toHaveURL('https://dev.invest.penomo.com/transactions');
        
        await checkVisibility([
            pm.transactionTo().getTransactionPeriodTitle(),
            pm.transactionTo().getTransactionPeriodFilter(),
            pm.transactionTo().getTransactionCategoryTitle(),
            pm.transactionTo().getTransactionCategory(),
            pm.transactionTo().getTransactionCategoryButton(),
            pm.transactionTo().getProjectTitle(),
            pm.transactionTo().getProject(),
            pm.transactionTo().getProjectButton(),
            pm.transactionTo().getClearAllFilters(),
        ]);

        await pm.transactionTo().getTransactionPeriodFilter().click();
        
        await expect(pm.transactionTo().getPeriodBox()).toBeVisible();
        
        await pm.transactionTo().getTransactionPeriodFilter().click();
        
        await pm.transactionTo().getTransactionCategoryButton().click();

        await checkVisibility([
            pm.transactionTo().getTransactionCategoryBox(),
            pm.transactionTo().getAllTransactionFilter(),
            pm.transactionTo().getSecondTransactionFilter()
        ]);

        await pm.transactionTo().getSecondTransactionFilter().click();
        
        await pm.transactionTo().getTransactionCategoryButton().click();
        
        await expect(pm.transactionTo().getAllTransactionFilterCheck()).toBeVisible();
        
        await expect(pm.transactionTo().getSecondTransactionFilterCheck()).toBeVisible();
        
        await pm.transactionTo().getClearAllFilters().click();
        
        await expect(pm.transactionTo().getSecondTransactionFilterCheck()).not.toBeVisible();

        await pm.transactionTo().getCloseFilters().click();
        
        await expect(pm.transactionTo().getAllTransactionFilterCheck()).not.toBeVisible();

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };

        await pm.dashboardTo().getStakingNav().click();
        
        await expect(page).toHaveURL('https://dev.invest.penomo.com/staking');
        
        await expect(pm.dashboardTo().getComingSoonText()).toBeVisible();

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };
        
        await pm.dashboardTo().getGovernanceNav().click();
        
        await expect(page).toHaveURL('https://dev.invest.penomo.com/governance');
        
        await expect(pm.dashboardTo().getComingSoonText()).toBeVisible();

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };
        
        await pm.dashboardTo().getSettingsNav().click();
        
        await expect(page).toHaveURL("https://dev.invest.penomo.com/settings");

        //Settings

        await checkVisibility([
            pm.settingsTo().getAccountPage(),
            pm.settingsTo().getNotificationPage(),
            pm.settingsTo().getAccountTitle(),
            pm.settingsTo().getUserDetailsTitle(),
            pm.settingsTo().getUserDetailsDescription(),
            pm.settingsTo().getFirstNameTitle(),
            pm.settingsTo().getFirstNameInput(),
            pm.settingsTo().getChangeFirstName(),
            pm.settingsTo().getLastNameTitle(),
            pm.settingsTo().getLastNameInput(),
            pm.settingsTo().getChangeLastName(),
            pm.settingsTo().getEmailTitle(),
            pm.settingsTo().getEmailInput(),
            pm.settingsTo().getKYCStatucTitle(),
            pm.settingsTo().getKYCStatus(),
            pm.settingsTo().getWalletDetailsTitle(),
            pm.settingsTo().getWalletAddressDescription(),
            pm.settingsTo().getWalletAddress(),
            pm.settingsTo().getCopyWalletAddressButton(),
            pm.settingsTo().getReferralLinkTitle(),
            pm.settingsTo().getReferralLinkDescription(),
            pm.settingsTo().getLinkDescription(),
            pm.settingsTo().getReferalLink(),
            pm.settingsTo().getCopyReferalLinkButton(),
            pm.settingsTo().getCompleteKYCBox(),
            pm.settingsTo().getCompleteKYCTitle(),
            pm.settingsTo().getCompleteKYCDescription(),
            pm.settingsTo().getStartKYCButton(),
            pm.settingsTo().getDeleteAccountButton()
        ]);

        await pm.settingsTo().getChangeFirstName().click();
        
        await pm.settingsTo().getFirstNameInput().fill(change_username);
        
        await pm.settingsTo().getSaveChangesNames().click();
        
        await expect(pm.settingsTo().getSuccessUpdateUserDataMessage()).toBeVisible();
        
        await pm.settingsTo().getChangeLastName().click(); 
        
        await pm.settingsTo().getLastNameInput().fill(change_surename);
        
        await pm.settingsTo().getSaveChangesNames().click();
        
        await expect(pm.settingsTo().getSuccessUpdateUserDataMessage()).toBeVisible(); 
        
        await pm.settingsTo().getCopyWalletAddressButton().click();
        
        await expect(pm.settingsTo().getAddressCopiedMessage()).toBeVisible();
        
        await pm.settingsTo().getCopyReferalLinkButton().click(); 

        await expect(pm.settingsTo().getReferalLinkCopiedMessage()).toBeVisible();
        
        await pm.settingsTo().getDeleteAccountButton().click();
        
        await checkVisibility([
            pm.settingsTo().getDeleteAccountBox(),
            pm.settingsTo().getDeleteAccountTitle(),
            pm.settingsTo().getDeleteAccountDescription(),
            pm.settingsTo().getCanselDeleteButton(),
            pm.settingsTo().getConfirmDeleteButton()
        ]);

        await pm.settingsTo().getCanselDeleteButton().click();
        
        await expect(pm.settingsTo().getDeleteAccountBox()).not.toBeVisible();
        
        await pm.settingsTo().getNotificationPage().click();
        
        await checkVisibility([
            pm.settingsTo().getNotificationsTitle(),
            pm.settingsTo().getEmailNotifications(),
            pm.settingsTo().getEmailNotificationsDescription(),
            pm.settingsTo().getNotificationSwitch(),
            pm.settingsTo().getNotificationSwitchDescription()
        ]);

        await pm.settingsTo().getNotificationSwitch().click();
        
        await expect(pm.settingsTo().getSuccessUpdateNotificationMessage()).toBeVisible();

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        
            await pm.dashboardTo().clickOnLogoutButtonForMobile();
        } 
        else {
            await pm.dashboardTo().getLogoutNav().click();
        }

        await page.waitForLoadState();
        
        await page.waitForURL('https://dev.invest.penomo.com/');

        await page.close();
    });
});
