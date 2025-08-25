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

        await pm.questsAdminTo().clickOnQuestsNav();

        await page.waitForURL('**/quest');

        await expect(page).toHaveURL('https://www.staging.admin.penomo.com/quest');

        await checkVisibility([
            pm.questsAdminTo().getChallengesNav(),
            pm.questsAdminTo().getFlipCardsNav(),
            pm.questsAdminTo().getSearchFiled(),
            pm.questsAdminTo().getTitleColomnTitle(),
            pm.questsAdminTo().getChallengeStaticIdTitle(),
        ]);

        await pm.questsAdminTo().getSearchFiled().fill("Challenge 1");

        try {
            await expect(pm.questsAdminTo().getChallenge1()).toBeVisible({ timeout: 8000 });
        } catch {
            await page.reload();
            await pm.questsAdminTo().clickOnFlipCardsNav();
            await pm.questsAdminTo().clickOnChallengeNav();
            await pm.questsAdminTo().getSearchFiled().fill("Challenge 1");
            await page.waitForTimeout(2000);
            await expect(pm.questsAdminTo().getChallenge1()).toBeVisible({ timeout: 10000 });
        }

        await pm.questsAdminTo().clickOnChallenge1();

        await checkVisibility([
            pm.questsAdminTo().getChallenge1Info(),
            pm.questsAdminTo().getEditButton(),
            pm.questsAdminTo().getIsLockedBox(),
            pm.questsAdminTo().getIsExpiredBox()
        ]);

        await pm.questsAdminTo().clickOnEditButton();

        await expect(pm.questsAdminTo().getCancelButton()).toBeVisible();

        await expect(pm.questsAdminTo().getSaveButton()).toBeVisible();

        await pm.questsAdminTo().getSelectIsLocked().selectOption("Yes");

        await pm.questsAdminTo().getSelectIsExpired().selectOption("Yes");

        await pm.questsAdminTo().clickOnSaveButton();

        await page.waitForLoadState();

        await pm.questsAdminTo().clickOnEditButton();

        await pm.questsAdminTo().getSelectIsLocked().selectOption("No");

        await pm.questsAdminTo().getSelectIsExpired().selectOption("No");

        await pm.questsAdminTo().clickOnSaveButton();

        await pm.questsAdminTo().clickOnCloseEditPage();

        //Flip Cards

        await expect(pm.questsAdminTo().getFlipCardsNav()).toBeVisible();

        await pm.questsAdminTo().clickOnFlipCardsNav();

        await checkVisibility([
            pm.questsAdminTo().getFlipCardStaticIdTitle(),
            pm.questsAdminTo().getFlipCard7()
        ]);

        await pm.questsAdminTo().clickOnFlipCard7();

        await expect(pm.questsAdminTo().getFlipCard7Info()).toBeVisible();

        await pm.questsAdminTo().clickOnEditButton();

        await checkVisibility([
            pm.questsAdminTo().getPointInput(),
            pm.questsAdminTo().getIsBonusCard(),
            pm.questsAdminTo().getIsExpired(),
            pm.questsAdminTo().getIsRedCard(),
            pm.questsAdminTo().getCancelButton(),
            pm.questsAdminTo().getSaveButton()
        ]);
        await pm.questsAdminTo().getPointInput().fill('1000');

        await pm.questsAdminTo().clickOnSaveButton();

        await pm.questsAdminTo().clickOnCloseEditPage();

        await page.close();
    })
})
