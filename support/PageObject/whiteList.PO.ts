import { Locator, Page, test } from '@playwright/test';

export class WhiteList {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getGettingWhitelist(): Locator {
        return this.page.locator('div h2', { hasText: "Getting Whitelisted" });
    };

    getInvestmentAmountTitle(): Locator {
        return this.page.locator('div h3', { hasText: "Investment Amount" });
    };

    getInvestmentAmountDescription(): Locator {
        return this.page.locator('p', { hasText: "Beyond the community sale capped at " });
    };

    getInvestmentSum(): Locator {
        return this.page.locator('input[placeholder="Enter investment amount in USDT"]');
    };

    getNextButton(): Locator {
        return this.page.locator('button', { hasText: "Next" });
    };

    getMetaMaskLogo(): Locator {
        return this.page.locator('g[clip-path="url(#clip0_563_5585)"]');
    };

    getMetaMaskTitle(): Locator {
        return this.page.locator('div h3', { hasText: 'Submit your external wallet address' });
    };

    getMetaMaskDescription(): Locator {
        return this.page.locator('div p', { hasText: "Enter your external wallet address to join the PNMO community presale whitelist. The token sale is done with" });
    };

    getBitbondLink(): Locator {
        return this.page.locator('a[target="_blank"]', { hasText: 'Bitbond' });
    };

    getInputWalletAddress(): Locator {
        return this.page.locator('input[placeholder="Enter your external wallet address"]');
    };

    getBackButton(): Locator {
        return this.page.locator('button', { hasText: "Back" });
    };

    getJoinPNMOCommunityButton(): Locator {
        return this.page.locator('button', { hasText: "Join PNMO Community Presale" });
    };

    getInvalidWalletAddressMessage(): Locator {
        return this.page.locator('p', { hasText: "Invalid Wallet Address" });
    };

    getSuccessInvite(): Locator {
        return this.page.locator('section.p-4.flex.flex-col.gap-7.mt-4.items-center');
    };

    getSuccessLogo(): Locator {
        return this.page.locator('.aspect-square.text-green-500.bg-green-10');
    };

    getSuccessTitle(): Locator {
        return this.page.locator('div h3', { hasText: "Whitelisting Initiated" });
    };

    getSuccessDescription(): Locator {
        return this.page.locator('div p', { hasText: "We have initiated your whitelisting process." });
    };

    getPNMOPresalePageButton(): Locator {
        return this.page.locator('button', { hasText: "PNMO presale page" });
    };

    getNotificationForInitated(): Locator {
        return this.page.locator('.notification-card.flex.border.border-monochrome-60');
    };

    



}