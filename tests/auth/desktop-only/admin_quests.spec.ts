import { test, expect } from '@playwright/test';
import { PageManager } from '../../../support/PageObject/pageManager';
import { checkVisibility } from '../../../support/PageObject/pageManager';
import { adminLogin } from '../../../support/login_as_admin';


test.describe("Admin quests test", () => {
    let pm: PageManager

    test('Check main function on admin about quests', async ({ page, context }) => {
        pm = new PageManager(page);

        await adminLogin(page, context, pm);

        await expect(page).toHaveURL('https://www.staging.admin.penomo.com/dashboard');

        await expect(pm.questsAdminTo().getNavigationBar()).toBeVisible();

        await expect(pm.questsAdminTo().getQuestsNav()).toBeVisible();

        await page.waitForTimeout(15000);

        await pm.questsAdminTo().getQuestsNav().click();

        await page.waitForURL('**/quest');

        await expect(page).toHaveURL('https://www.staging.admin.penomo.com/quest');

        await checkVisibility([
            pm.questsAdminTo().getChallengesNav(),
            pm.questsAdminTo().getFlipCardsNav(),
            pm.questsAdminTo().getViewQuestDiagramButton(),
            pm.questsAdminTo().getSearchFiled(),
            pm.questsAdminTo().getTitleColomnTitle(),
            pm.questsAdminTo().getChallengeStaticIdTitle(),
            pm.questsAdminTo().getChellenge1()
        ]);

        await pm.questsAdminTo().getViewQuestDiagramButton().click();

        await expect(pm.questsAdminTo().getQuestsDiagramPhoto()).toBeVisible();

        await expect(pm.questsAdminTo().getCloseDiagramButton()).toBeVisible();

        await pm.questsAdminTo().getCloseDiagramButton().click();

        await expect(pm.questsAdminTo().getQuestsDiagramPhoto()).not.toBeVisible();

        await pm.questsAdminTo().getSearchFiled().fill("Challenge 1");

        try {
            await expect(pm.questsAdminTo().getChellenge1()).toBeVisible({ timeout: 8000 });
        } catch {
            await page.reload();
            await pm.questsAdminTo().getSearchFiled().fill("Challenge 1");
            await page.waitForTimeout(2000);
            await expect(pm.questsAdminTo().getChellenge1()).toBeVisible({ timeout: 10000 });
        }

        await pm.questsAdminTo().getChellenge1().click();

        await checkVisibility([
            pm.questsAdminTo().getChallenge1Info(),
            pm.questsAdminTo().getEditButton(),
            pm.questsAdminTo().getIsLockedBox(),
            pm.questsAdminTo().getIsExpiredBox()
        ]);

        await pm.questsAdminTo().getEditButton().click();

        await expect(pm.questsAdminTo().getCancelButton()).toBeVisible();

        await expect(pm.questsAdminTo().getSaveButton()).toBeVisible();

        await pm.questsAdminTo().getSelectIsLocked().selectOption("Yes");

        await pm.questsAdminTo().getSelectIsExpired().selectOption("Yes");

        await pm.questsAdminTo().getSaveButton().click();

        await pm.questsAdminTo().getEditButton().click();

        await pm.questsAdminTo().getSelectIsLocked().selectOption("No");

        await pm.questsAdminTo().getSelectIsExpired().selectOption("No");

        await pm.questsAdminTo().getSaveButton().click();

        await pm.questsAdminTo().getCloseEditPage().click();

        //Flip Cards

        await expect(pm.questsAdminTo().getFlipCardsNav()).toBeVisible();

        await pm.questsAdminTo().getFlipCardsNav().click();

        await checkVisibility([
            pm.questsAdminTo().getFlipCardStaticIdTitle(),
            pm.questsAdminTo().getFlipCard7()
        ]);

        await pm.questsAdminTo().getFlipCard7().click();

        await expect(pm.questsAdminTo().getFlipCard7Info()).toBeVisible();

        await pm.questsAdminTo().getEditButton().click();

        await checkVisibility([
            pm.questsAdminTo().getPointInput(),
            pm.questsAdminTo().getIsBonusCard(),
            pm.questsAdminTo().getIsExpired(),
            pm.questsAdminTo().getIsRedCard(),
            pm.questsAdminTo().getCancelButton(),
            pm.questsAdminTo().getSaveButton()
        ]);
        await pm.questsAdminTo().getPointInput().fill('1000');

        await pm.questsAdminTo().getSaveButton().click();

        await pm.questsAdminTo().getCloseEditPage().click();

        await page.close();
    })
})
