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
    let email: string;

    test.beforeAll(async ( {} ) => {
        const email = getGeneratedEmail();
        await addUserToQuests(email);
    });

    test.afterAll(async ({ page }) => {
        const email = getGeneratedEmail();
        await deleteUserFromQuests(email);
        await page.close();
    })

    test("Progressive challenges completion", async ({ page, context, request }) => {
        pm = new PageManager(page);

        await page.goto(stageBaseUrl);

        await expect(page).toHaveURL("https://www.staging.invest.penomo.com/dashboard");

        await page.reload();

        await checkVisibility([
            pm.dashboardTo().getCampaignsNav(),
            pm.dashboardTo().getReferralLink(),
            pm.dashboardTo().getQuests(),
            pm.dashboardTo().getLeaderboard()
        ])

        await pm.dashboardTo().getCampaignsNav().click();

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=referral');

        await pm.dashboardTo().getQuests().click();

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=quests');

        await pm.dashboardTo().getLeaderboard().click();

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=leaderboard');

        await pm.dashboardTo().getReferralLink().click();

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

        await pm.questsTo().getQuestsPage().click();

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=quests');

        await pm.questsTo().getSkipButton().click();

        await checkVisibility([
            pm.questsTo().getCompleteYourTasks(),
            pm.questsTo().getCompleteYourTasksDescription(),
            pm.questsTo().getCompleteYourTasksVideoHelp(),
            pm.questsTo().getBackButton(),
            pm.questsTo().getNextButton(),
        ]);

        await pm.questsTo().getNextButton().click();

        await checkVisibility([
            pm.questsTo().getQuantumCoresPage(),
            pm.questsTo().getQuantumCoresDescription(),
            pm.questsTo().getQuantumCoresVideo(),
            pm.questsTo().getBackButton(),
            pm.questsTo().getNextButton()
        ]);

        await pm.questsTo().getNextButton().click();

        await checkVisibility([
            pm.questsTo().getBewareOfDoomCoresPage(),
            pm.questsTo().getBewareOfDoomCoresDescription(),
            pm.questsTo().getBewareOfDoomCoresVideo(),
            pm.questsTo().getLetsStartButton(),
            pm.questsTo().getBackButton()
        ]);

        await pm.questsTo().getLetsStartButton().click();

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

                await pm.questsTo().getCloseQuestButton().click();
            },
            1: async () => {
                await expect(pm.questsTo().getJoinTelegramQuest()).toBeVisible();

                await expect(pm.questsTo().getJoinTelegramQuestDescription()).toBeVisible();

                await pm.questsTo().getCloseQuestButton().click();
            },
            3: async () => {
                await expect(pm.questsTo().getJoinDiscordQuest()).toBeVisible();

                await expect(pm.questsTo().getJoinDiscordQuestDescription()).toBeVisible();

                await pm.questsTo().getCloseQuestButton().click();
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

                await pm.questsTo().getCloseQuestButton().click();
            }
        }

        await pm.questsTo().getLeaderboardPage().click();

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
            pm.questsTo().getLeftButton(),
            pm.questsTo().getRightButton(),
            pm.questsTo().getPageNumber()
        ]);

        await pm.questsTo().getRightButton().click();

        await expect(pm.questsTo().getPageNumber()).toHaveValue('2');

        await pm.questsTo().getLeftButton().click();

        await expect(pm.questsTo().getPageNumber()).toHaveValue('1');

        await pm.questsTo().getPageNumber().fill('5');

        const rows = pm.questsTo().getLeadersLines();

        const rowCount = await rows.count();

        expect(rowCount).toBeGreaterThanOrEqual(10);

        await pm.questsTo().get25LeadersPerPage().click();

        await page.waitForTimeout(2000);

        expect(await rows.count()).toBeGreaterThanOrEqual(25);

        await pm.questsTo().get50LeadersPerPage().click();

        await page.waitForTimeout(2000);

        expect(await rows.count()).toBeGreaterThanOrEqual(50);

        await pm.questsTo().get100LeaderPerPage().click();

        await page.waitForTimeout(2000);

        expect(await rows.count()).toBeGreaterThanOrEqual(100);

        await pm.questsTo().get10LeaderPerPage().click();

        await page.waitForTimeout(2000);

        expect(rowCount).toBeGreaterThanOrEqual(10);
    });

    test("Testcopmleted quests", async ({ page, context, request }) => {
        pm = new PageManager(page);

        await page.goto(stageBaseUrl);

        await expect(page).toHaveURL("https://www.staging.invest.penomo.com/dashboard");

        await pm.dashboardTo().getCampaignsNav().click();

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=referral');

        await checkVisibility([
            pm.questsTo().getCampaignsNavBar(),
            pm.questsTo().getReferralPage(),
            pm.questsTo().getQuestsPage(),
            pm.questsTo().getLeaderboardPage(),
            pm.questsTo().getReferralTitle(),
            pm.questsTo().getReferralDescription(),
            pm.questsTo().getReferralLinkBox(),
            pm.questsTo().getXPHelpText()
        ]);

        await page.route('**/challenges/quests', async route => {
            const response = await route.fetch();
            const json = await response.json();

            const unlockChallenges = (challenges: any[]) =>
                challenges.map(challenge => {
                    if (/^CH\d+$/.test(challenge.challengeStaticId)) {
                        return {
                            ...challenge,
                            isChallengeCompleted: true,
                            challengeCompletedAt: new Date().toISOString(),
                            isLocked: false,
                            isExpired: false,
                            isFlipCardLocked: false,
                            flipCards: (challenge.flipCards || []).map((card: any) => ({
                                ...card,
                                isFlipCardLocked: false,
                                flipCardPoints: 500,
                                isFlipCardRevealed: true,
                                isFlipCardClaimed: true,
                                isDestroyed: false,
                                isExpired: false,
                            })),
                        };
                    }
                    return challenge;
                });

            if (Array.isArray(json.data.challengeDetails)) {
                json.data.challengeDetails = unlockChallenges(json.data.challengeDetails);
            }
            if (Array.isArray(json.data.challenges)) {
                json.data.challenges = unlockChallenges(json.data.challenges);
            }
            if (Array.isArray(json.data.completedChallenges)) {
                json.data.completedChallenges = unlockChallenges(json.data.completedChallenges);
            }

            await route.fulfill({
                status: response.status(),
                headers: {
                    ...response.headers(),
                    'content-type': 'application/json',
                },
                body: JSON.stringify(json),
            });
        });
        await page.route('**/api/challenges/quests/usertracking', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    ok: true,
                    code: 200,
                    message: "Challenge retrieved successfully",
                    data: {
                        claimedPoint: 50000,
                        completionPercentage: 100,
                        questCompleted: 10,
                        totalQuest: 13,
                        activeQuest: 0,
                        totalFlipCardPoints: 516497820
                    }
                })
            });
        });

        await pm.questsTo().getQuestsPage().click();

        await expect(page).toHaveURL('https://www.staging.invest.penomo.com/campaigns?section=quests');

        await pm.questsTo().getSkipButton().click();

        await checkVisibility([
            pm.questsTo().getCompleteYourTasks(),
            pm.questsTo().getCompleteYourTasksDescription(),
            pm.questsTo().getCompleteYourTasksVideoHelp(),
            pm.questsTo().getBackButton(),
            pm.questsTo().getNextButton(),
        ]);

        await pm.questsTo().getNextButton().click();

        await checkVisibility([
            pm.questsTo().getQuantumCoresPage(),
            pm.questsTo().getQuantumCoresDescription(),
            pm.questsTo().getQuantumCoresVideo(),
            pm.questsTo().getBackButton(),
            pm.questsTo().getNextButton()
        ]);

        await pm.questsTo().getNextButton().click();

        await checkVisibility([
            pm.questsTo().getBewareOfDoomCoresPage(),
            pm.questsTo().getBewareOfDoomCoresDescription(),
            pm.questsTo().getBewareOfDoomCoresVideo(),
            pm.questsTo().getLetsStartButton(),
            pm.questsTo().getBackButton()
        ]);

        await pm.questsTo().getLetsStartButton().click();

        const InfoCon = await pm.questsTo().getInfoContainer();

        await expect(InfoCon).toHaveCount(4);

        await expect(InfoCon).toContainText([
            "ACTIVE QUESTS",
            "QUESTS COMPLETED",
            "CLAIMED XP",
            "COMPLETION PROGRESS"
        ]);

        const questButtons = pm.questsTo().getQuests();

        const count = await questButtons.count();
        console.log(`Find ${count} quests`);

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

        console.log('Right DOM indexs:', correctOrder);

        for (let i = 0; i < count; i++) {
            if (i === 2) {
                console.log(`Skip quest №${i + 1}`);
                continue;
            }

            const domIndex = correctOrder[i];
            console.log(`Click on the quest №${i + 1} (DOM index: ${domIndex})`);
            const svgElement = questButtons.nth(domIndex);

            const svgHTML = await svgElement.evaluate((el) => el.outerHTML);

            const expectedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" class="text-black"><path d="M10.625 21.5625L16.8663 29.375L29.375 13.75" stroke="#1A1C22" stroke-width="4.6875" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

            expect(svgHTML.replace(/\s+/g, '')).toBe(expectedSVG.replace(/\s+/g, ''));

        }
    });
});