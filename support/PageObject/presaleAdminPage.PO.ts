import { Locator, Page, test } from '@playwright/test';
import { throws } from 'assert';

export class AdminPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getNavigationBar(): Locator {
        return this.page.locator('#navbar-default');
    };

    getPresaleNavigation(): Locator {
        return this.page.locator('li a[href="/presale"]');
    };

    getPresaleBox(): Locator {
        return this.page.locator('.bg-white.rounded-lg.p-4.w-full');
    };

    getPresaleNavBar(): Locator {
        return this.page.locator('.flex.flex-col').nth(6);
    };

    getLatestWalletButton(): Locator {
        return this.page.locator('button', { hasText: "Get Latest Wallet Address to Add to Bitbond" });
    };

    getLattestWalletsBox(): Locator {
        return this.page.locator('.flex.flex-col.h-full').nth(2);
    };

    getAddedWalletButton(): Locator {
        return this.page.locator('button', { hasText: "Added Wallet Addresses to Bitbond" });
    };

    getCopyWalletButton(): Locator {
        return this.page.locator('button', { hasText: "Copy Wallet Addresses" });
    };

    getConfirmWalletAdditionNotify(): Locator {
        return this.page.locator('.flex-1.overflow-auto.p-6');
    };

    getConfirmWalletTitle(): Locator {
        return this.page.locator('h3', { hasText: "Confirm Wallet Addition" });
    };

    getConfirmWalletDescription(): Locator {
        return this.page.locator('p', { hasText: "Are you sure you have added all the wallet " });
    };

    getWalletAddresses(): Locator {
        return this.page.locator('.w-full.max-h-60.overflow-y-auto.border');
    };

    getConfirmWalletCancelButton(): Locator {
        return this.page.locator('button', { hasText: "Cancel" });
    };

    getConfirmWalletConfirmButton(): Locator {
        return this.page.locator('button', { hasText: "Confirm" });
    };

    getNoNewWalletsMessage(): Locator {
        return this.page.locator('div', { hasText: "No New Wallets Whitelisted Yet" });
    };

    //Step 2

    getUsersNavigation(): Locator {
        return this.page.locator('li a[href="/users"]');
    };

    getUsersNavBar(): Locator {
        return this.page.locator('.flex.flex-col.md:flex-row.justify-between');
    };

    getUsersList(): Locator {
        return this.page.locator('.bg-white.rounded-lg.p-4.w-full');
    };

    getLastUser(): Locator {
        return this.page.locator('.grid.grid-cols-7').nth(1);
    };

    getUserInformationLeft(): Locator {
        return this.page.locator('.bg-white.shadow-lg');
    };

    getUserInformatiomEditButton(): Locator {
        return this.page.locator('button', { hasText: "Edit" });
    };

    getEditionUserPage(): Locator {
        return this.page.locator('.grid.grid-cols-2.gap-4').first();
    };

    getKYCStatus(): Locator {
        return this.page.locator('p:has-text("KYC Status")').locator('..').locator('select');
    }

    getHasPurchasedPRNMO(): Locator {
        return this.page.locator('p:has-text("Has purchased PRNMO")').locator('..').locator('select');
    }

    getSelectHasPurchasedPRNMO(): Locator {
        return this.page.locator('select.border.rounded-md.p-1.text-sm').nth(2);
    };

    getPRNMOTransaction(): Locator {
        return this.page.locator('.flex.flex-col.gap-4').nth(2);
    };

    getPRNMOAmount(): Locator {
        return this.page.locator('div p', { hasText: 'PRNMO Amount' });
    };

    getUSDAmount(): Locator {
        return this.page.locator('div p', { hasText: "USD Amount" });
    };

    getTransactionHash(): Locator {
        return this.page.locator('div p', { hasText: "Transaction Hash" });
    };

    getInputToken(): Locator {
        return this.page.locator('.text-xs.w-full.border.rounded-md').nth(7);
    };

    getInputTransactionHash(): Locator {
        return this.page.locator('.text-xs.w-full.border.rounded-md').nth(9);
    };

    getSaveButton(): Locator {
        return this.page.locator('button', { hasText: "Save" });
    };

    getCloseButton(): Locator {
        return this.page.locator('img[alt="crossIcon"]');
    };

    getSuccessfulyUpdateNotify(): Locator {
        return this.page.locator('.go3958317564');
    };


}