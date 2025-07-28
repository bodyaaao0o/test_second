import { Locator, Page } from '@playwright/test'

export class QuestsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    };

    getNavigationBar(): Locator {
        return this.page.locator('#navbar-default');
    };

    getQuestsNav(): Locator {
        return this.page.locator('span.pl-4.flex.my-auto', { hasText: "Quest" });
    };

    getChallengesNav(): Locator {
        return this.page.locator('a', { hasText: "Challenges" });
    };

    getFlipCardsNav(): Locator {
        return this.page.locator('a', { hasText: "Flip Cards" });
    };

    getViewQuestDiagramButton(): Locator {
        return this.page.locator('button', { hasText: "View Quest Diagram" });
    };

    getQuestsDiagramPhoto(): Locator {
        return this.page.locator('.react-viewer-image.drag.react-viewer-image-transition');
    };

    getCloseDiagramButton(): Locator {
        return this.page.locator('.react-viewer-close.react-viewer-btn');
    };

    getSearchFiled(): Locator {
        return this.page.locator('input[placeholder="Search by title or static ID..."]');
    };

    getTitleColomnTitle(): Locator {
        return this.page.locator('span', { hasText: "Title" });
    };

    getChallengeStaticIdTitle(): Locator {
        return this.page.locator('span', { hasText: "Challenge Static Id" });
    };

    getChellenge1(): Locator {
        return this.page.locator('div.grid.grid-cols-2.py-4.border-b.border-monochrome-10', { hasText: "Challenge 1" }).nth(1);
    };

    getChallenge1Info(): Locator {
        return this.page.locator('.flex.justify-between.items-center', { hasText: "Challenge Details" });
    };

    getEditButton(): Locator {
        return this.page.locator('button', { hasText: "Edit" });
    };

    getIsLockedBox(): Locator {
        return this.page.locator('div.flex.flex-col.gap-4', { hasText: "Is Locked?" });
    };

    getSelectIsLocked(): Locator {
        return this.page.locator('select[name="isLocked"]');
    };

    getIsExpiredBox(): Locator {
        return this.page.locator('div.flex.flex-col.gap-4', { hasText: "Is Expired?" });
    };

    getSelectIsExpired(): Locator {
        return this.page.locator('select[name="isExpired"]');
    };

    getCancelButton(): Locator {
        return this.page.locator('button', { hasText: "Cancel" });
    };

    getSaveButton(): Locator {
        return this.page.locator('button', { hasText: "Save" });
    };

    getCloseEditPage(): Locator {
        return this.page.locator('img[alt="crossIcon"]');
    };

    //Flip Cards

    getFlipCardStaticIdTitle(): Locator {
        return this.page.locator('span', { hasText: "Flip Card Static Id" });
    };

    getFlipCard7(): Locator {
        return this.page.locator('.grid.grid-cols-2.py-4.border-b.border-monochrome-10', { hasText: "Flip Card 7" });
    };

    getFlipCard7Info(): Locator {
        return this.page.locator('.flex.justify-between.items-center', { hasText: "Flip Card Details" });
    };

    getPointInput(): Locator {
        return this.page.locator('input.border.border-monochrome-10.rounded.px-2').nth(2);
    }


    getIsBonusCard(): Locator {
        return this.page.locator('p.text-xs.text-monochrome-30.mb-2', { hasText: "Is Bonus Card?" });
    };

    getIsExpired(): Locator {
        return this.page.locator('p.text-xs.text-monochrome-30.mb-2', { hasText: "Is Expired?" });
    };

    getIsRedCard(): Locator {
        return this.page.locator('p.text-xs.text-monochrome-30.mb-2', { hasText: "Is Red Card?" });
    };





}