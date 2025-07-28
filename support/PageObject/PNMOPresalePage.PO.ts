import { test, Page, Locator } from '@playwright/test';
import { throws } from 'assert';

export class PresalePage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getPresalePageNav(): Locator {
        return this.page.locator('li a[href="/presale"]');
    };

    getPresalePageBox(): Locator {
        return this.page.locator('.bg-monochrome-100.p-4.flex.justify-center.items-center');
    };

    getTermsAndConditionsNotify(): Locator {
        return this.page.locator(".flex-1.overflow-auto.p-4.bg-monochrome-100");
    };

    getConfirmTermsAndConditionsCheckBox(): Locator {
        return this.page.locator('.w-4.h-4.flex.items-center.justify-center');
    };

    getTermsAndConditionsDescription(): Locator {
        return this.page.locator('label', {hasText: "I confirm that I have thoroughly read"});
    };

    getTermsAndConditionsCancelButton(): Locator {
        return this.page.locator('button', {hasText: "Cancel"});
    };

    getTermsAndConditionsAgreeAndContinueButton(): Locator {
        return this.page.locator('button', {hasText: "Agree & Continue"});
    };

    getIFrameForTokens(): Locator {
        return this.page.locator('iframe[name="tokensale"]');
    };


}