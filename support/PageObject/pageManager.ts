import { test, expect, Page, Locator } from '@playwright/test';
import { LoginPage, ProfileInfo } from '../PageObject/loginPage.PO';
import { DashboardPage } from './dashboardPage.PO';
import { WhiteList } from './whiteList.PO';
import { PresalePage } from './PNMOPresalePage.PO';
import { AdminPage } from './presaleAdminPage.PO';
import { CampaignsPage } from './campaignsPage.PO';
import { PortfolioPage } from './portfolioPage.PO';
import { QuestsPage } from './questsPageAdmin.PO';
import { SettingPage } from './settingPage.PO';
import { TransactionPage } from './transacrionsPage.PO';


export class PageManager {
    private readonly page : Page;
    private readonly loginPage : LoginPage;
    private readonly profileInfo: ProfileInfo;
    private readonly dashboard: DashboardPage;
    private readonly whiteList: WhiteList;
    private readonly presale: PresalePage;
    private readonly adminPresale: AdminPage;
    private readonly quests: CampaignsPage;
    private readonly portfolio: PortfolioPage;
    private readonly questsAdmin: QuestsPage;
    private readonly settings: SettingPage;
    private readonly transaction: TransactionPage; 


    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.profileInfo = new ProfileInfo(this.page);
        this.dashboard = new DashboardPage(this.page);
        this.whiteList = new WhiteList(this.page);
        this.presale = new PresalePage(this.page);
        this.adminPresale = new AdminPage(this.page);
        this.quests = new CampaignsPage(page);
        this.portfolio = new PortfolioPage(page);
        this.questsAdmin = new QuestsPage(page);
        this.settings = new SettingPage(page);
        this.transaction = new TransactionPage(page);
    }

    loginTo() {
        return this.loginPage
    }

    profile() {
        return this.profileInfo
    }

    dashboardTo() {
        return this.dashboard;
    }

    whiteListTo() {
        return this.whiteList;
    }

    presaleTo() {
        return this.presale;
    }

    adminTo() {
        return this.adminPresale;
    }

    questsTo() {
        return this.quests;
    }

    portfolioTo() {
        return this.portfolio;
    }

    questsAdminTo() {
        return this.questsAdmin;
    }

    settingsTo() {
        return this.settings;
    };

    transactionTo() {
        return this.transaction;
    }
}

export const checkVisibility = async (elements: any[]) => {
    for(const element of elements) {
        await expect(element).toBeVisible();
    }
}

export const checkVisibilityWithRetry = async (
    locators: Locator[],
    retries = 5,
    delay = 3000,
    page: Page 
) => {
    for (let i = 0; i < retries; i++) {
        try {
            for (const locator of locators) {
                await expect(locator).toBeVisible({ timeout: 5000 });
            }
            return;
        } catch (e) {
            if (i === retries - 1) throw e;
            await page.waitForTimeout(delay);
            await page.reload();
        }
    }
};