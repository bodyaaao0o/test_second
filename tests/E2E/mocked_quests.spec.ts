import { test, expect } from '@playwright/test';
import { PageManager, checkVisibility } from '../../support/PageObject/pageManager';
import { env } from '../../support/data';
import { getGeneratedEmail } from '../../support/email';
import { deleteUserFromQuests } from '../../support/growthbook';

test.use({ storageState: 'playwright/.auth/invest_login.json' })
const { stageBaseUrl } = env;

test.describe("Mocked quests", () => {

    let pm: PageManager;

    test.afterAll(async ({}) => {
        const email = getGeneratedEmail();
        await deleteUserFromQuests(email);
    })


    test.skip("Test quest with fake values", async({page}) => {
        await page.unrouteAll();
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

        // await pm.questsTo().getSkipButton().click();

        // await checkVisibility([
        //     pm.questsTo().getCompleteYourTasks(),
        //     pm.questsTo().getCompleteYourTasksDescription(),
        //     pm.questsTo().getCompleteYourTasksVideoHelp(),
        //     pm.questsTo().getBackButton(),
        //     pm.questsTo().getNextButton(),
        // ]);

        // await pm.questsTo().getNextButton().click();

        // await checkVisibility([
        //     pm.questsTo().getQuantumCoresPage(),
        //     pm.questsTo().getQuantumCoresDescription(),
        //     pm.questsTo().getQuantumCoresVideo(),
        //     pm.questsTo().getBackButton(),
        //     pm.questsTo().getNextButton()
        // ]);

        // await pm.questsTo().getNextButton().click();

        // await checkVisibility([
        //     pm.questsTo().getBewareOfDoomCoresPage(),
        //     pm.questsTo().getBewareOfDoomCoresDescription(),
        //     pm.questsTo().getBewareOfDoomCoresVideo(),
        //     pm.questsTo().getLetsStartButton(),
        //     pm.questsTo().getBackButton()
        // ]);

        // await pm.questsTo().getLetsStartButton().click();

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
})