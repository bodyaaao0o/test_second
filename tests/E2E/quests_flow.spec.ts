import { test, expect, Page} from '@playwright/test';
import { PageManager } from '../../support/PageObject/pageManager';
import { env } from '../../support/data';
import { checkVisibility } from '../../support/PageObject/pageManager';
import { addUserToQuests, deleteUserFromQuests } from '../../support/growthbook';
import { getGeneratedEmail } from '../../support/email';


const { stageBaseUrl } = env;


interface Challenge {
    challengeStaticId: string;
    isChallengeCompleted?: boolean;
    challengeCompletedAt?: string;
    [key: string]: any;
}

test.use({ storageState: 'playwright/.auth/invest_login.json' });


test.describe("Quests complete test", () => {

    let pm: PageManager;
    let page: Page;

    test.beforeAll(async ( {} ) => {
        const email = getGeneratedEmail();
        await addUserToQuests(email);
    });

    test.afterAll(async ({}) => {
        const email = getGeneratedEmail();
        await deleteUserFromQuests(email);
    })


    test("Progressive challenges completion", async ({ page}, testInfo) => {
        const isMobile = testInfo.project.use.isMobile;
        pm = new PageManager(page);

        await page.goto(stageBaseUrl);

        await expect(page).toHaveURL("https://www.staging.invest.penomo.com/dashboard");

        await page.reload();

        if (isMobile) {
            await pm.dashboardTo().clickOnBurgerMenu();
        };

        await checkVisibility([
            pm.dashboardTo().getCampaignsNav(),
            pm.dashboardTo().getReferralLink(),
            pm.dashboardTo().getQuests(),
            pm.dashboardTo().getLeaderboard()
        ])

        await pm.dashboardTo().clickOnCampaignsNav();

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=referral');

        try{
            if(isMobile) {
                await pm.questsTo().clickOnQuestsPage();
            } else {
                await pm.dashboardTo().clickOnQuests();
            };
    
            await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=quests');
        }
        catch {
            await page.reload();
            if(isMobile) {
                await pm.questsTo().clickOnQuestsPage();
            } else {
                await pm.dashboardTo().clickOnQuests();
            }

    
            await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=quests');
        }

        if (isMobile) {
            await pm.questsTo().clickOnLeaderboardPage();
        } else {
            await pm.dashboardTo().clickOnLeaderboard();
        };

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=leaderboard');

        if (isMobile) {
            await pm.questsTo().clickOnReferralPage();
        } else {
            await pm.dashboardTo().clickOnReferralLink();
        }

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=referral');

        await checkVisibility([
            pm.questsTo().getCampaignsNavBar(),
            pm.questsTo().getReferralPage(),
            pm.questsTo().getQuestsPage(),
            pm.questsTo().getLeaderboardPage(),
            pm.questsTo().getReferralTitle(),
            pm.questsTo().getReferralDescription(),
            pm.questsTo().getReferralLinkBox(),
            pm.questsTo().getCopyReferralLinkbutton(),
            pm.questsTo().getXPHelpText()
        ]);

        if (isMobile) {
            await pm.questsTo().clickOnQuestsPage();
        } else {
            await pm.questsTo().clickOnQuestsPage();
        }

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=quests');

        await pm.questsTo().clickOnSkipButton();

        await checkVisibility([
            pm.questsTo().getCompleteYourTasks(),
            pm.questsTo().getCompleteYourTasksDescription(),
            pm.questsTo().getCompleteYourTasksVideoHelp(),
            pm.questsTo().getBackButton(),
            pm.questsTo().getNextButton(),
        ]);

        await pm.questsTo().clickOnNextButton();

        await checkVisibility([
            pm.questsTo().getQuantumCoresPage(),
            pm.questsTo().getQuantumCoresDescription(),
            pm.questsTo().getQuantumCoresVideo(),
            pm.questsTo().getBackButton(),
            pm.questsTo().getNextButton()
        ]);

        await pm.questsTo().clickOnNextButton();

        await checkVisibility([
            pm.questsTo().getBewareOfDoomCoresPage(),
            pm.questsTo().getBewareOfDoomCoresDescription(),
            pm.questsTo().getBewareOfDoomCoresVideo(),
            pm.questsTo().getLetsStartButton(),
            pm.questsTo().getBackButton()
        ]);

        await pm.questsTo().clickOnLetsStartButton();

        const InfoCon = await pm.questsTo().getInfoContainer();

        await expect(InfoCon).toHaveCount(4);

        await expect(InfoCon).toContainText([
            "ACTIVE QUESTS",
            "QUESTS COMPLETED",
            "CLAIMED XP",
            "COMPLETION PROGRESS"
        ]);

        const questButtons = page.locator('svg.text-black');

        const count = await questButtons.count();
        console.log(`Finded ${count} quests`);

        const validIndices = [];
        for (let i = 1; i < count; i++) {
            if (i !== 2) {
                validIndices.push(i);
            };
        }

        const uniqueChecks: Record<number, () => Promise<void>> = {
            0: async () => {
                await expect(pm.questsTo().getFollowUsOnXQuest()).toBeVisible();

                await expect(pm.questsTo().getFollowUsOnXQuestDescription()).toBeVisible();

                await pm.questsTo().clickOnCloseQuestButton();
            },
            1: async () => {
                await expect(pm.questsTo().getJoinTelegramQuest()).toBeVisible();

                await expect(pm.questsTo().getJoinTelegramQuestDescription()).toBeVisible();

                await pm.questsTo().clickOnCloseQuestButton();
            },
            3: async () => {
                await expect(pm.questsTo().getJoinDiscordQuest()).toBeVisible();

                await expect(pm.questsTo().getJoinDiscordQuestDescription()).toBeVisible();

                await pm.questsTo().clickOnCloseQuestButton();
            }
        };

        const correctOrder = [];
        for (let i = 0; i < count; i++) {
            if (i === 7) {
                correctOrder.push(8);
            } else if (i === 8) {
                correctOrder.push(7);
            } else {
                correctOrder.push(i);
            }
        }

        console.log(correctOrder);

        for (let i = 0; i < count; i++) {
            if (i === 2) {
                console.log(`Skip element №${i + 1}`);
                continue;
            }

            const domIndex = correctOrder[i];

            console.log(`Click on the quest №${i + 1} (DOM index: ${domIndex})`);

            await questButtons.nth(domIndex).click();

            if (uniqueChecks[i]) {
                await uniqueChecks[i]();
            } else {
                const buttonText = `Challenge ${i}`;

                await expect(page.getByRole('button', { name: buttonText })).toBeVisible();

                await expect(pm.questsTo().getRetweetOnXQuest()).toBeVisible();

                await expect(pm.questsTo().getRetweetOnXQuestDescription()).toBeVisible();

                await pm.questsTo().clickOnCloseQuestButton();
            }
        }

        await pm.questsTo().clickOnLeaderboardPage();

        await checkVisibility([
            pm.questsTo().getYourRank(),
            pm.questsTo().getYourPoints(),
            pm.questsTo().getQuestsCompleted(),
            pm.questsTo().getLeaderboard(),
            pm.questsTo().getLineCountBox(),
            pm.questsTo().get25LeadersPerPage(),
            pm.questsTo().get50LeadersPerPage(),
            pm.questsTo().get10LeaderPerPage(),
            pm.questsTo().get100LeaderPerPage(),
            pm.questsTo().getPageNumbersBox(),
            pm.questsTo().getLeftPaginationButton(),
            pm.questsTo().getRightPaginationButton(),
            pm.questsTo().getPageNumber()
        ]);

        await pm.questsTo().clickOnRightButton();

        await expect(pm.questsTo().getPageNumber()).toHaveValue('2');

        await pm.questsTo().clickOnLeftButton();

        await expect(pm.questsTo().getPageNumber()).toHaveValue('1');

        await pm.questsTo().getPageNumber().fill('5');

        const rows = pm.questsTo().getLeadersLines();

        const rowCount = await rows.count();

        expect(rowCount).toBeGreaterThanOrEqual(10);

        await pm.questsTo().clickOn25LeadersPerPageButton();

        await page.waitForTimeout(2000);

        try{
            expect(await rows.count()).toBeGreaterThanOrEqual(25);
        } catch {
            await pm.questsTo().clickOn25LeadersPerPageButton();

            await page.waitForTimeout(2000);

            expect(await rows.count()).toBeGreaterThanOrEqual(25);
        }

        await pm.questsTo().clickOn50LeadersPerPageButton();

        await page.waitForTimeout(2000);

        expect(await rows.count()).toBeGreaterThanOrEqual(50);

        await pm.questsTo().clickOn100LeadersPerPageButton();

        await page.waitForTimeout(2000);

        expect(await rows.count()).toBeGreaterThanOrEqual(100);

        await pm.questsTo().clickOn10LeadersPerPageButton();

        await page.waitForTimeout(2000);

        expect(rowCount).toBeGreaterThanOrEqual(10);
    });
});