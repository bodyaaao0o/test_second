import { test, expect, BrowserContext, Page, chromium, firefox } from '@playwright/test';
import { PageManager } from '../support/PageObject/pageManager';
import { env } from '../support/data';
import { checkVisibility } from '../support/PageObject/pageManager';
import { adminLogin } from '../support/login_as_admin';
import { investorLogin } from '../support/login_as_investor';
import {
    setupComprehensiveMocking,
    completeChallengesStepByStep,
    debugAllRequests, setupMockClaimReward, claimState//autoCompleteAllChallenges,// checkRewardStates
} from '../support/quests_complete';

interface Challenge {
    challengeStaticId: string;
    isChallengeCompleted?: boolean;
    challengeCompletedAt?: string;
    [key: string]: any;
}

test.describe("Quests complete test", () => {
    let pm: PageManager;
    let page: Page;

    test("Progressive challenges completion", async ({ page, context }) => {
        pm = new PageManager(page);

        // Включаємо відладку запитів (опціонально)
        await debugAllRequests(page);

        await investorLogin(page, context, pm);

        await expect(page).toHaveURL("https://dev.invest.penomo.com/dashboard");
        await pm.dashboardTo().getCampaignsNav().click();
        await expect(page).toHaveURL('https://dev.invest.penomo.com/campaigns');

        await checkVisibility([
            pm.questsTo().getCampaignsNavBar(),
            pm.questsTo().getInfoPage(),
            pm.questsTo().getQuestsPage(),
            pm.questsTo().getLeaderboardPage(),
            pm.questsTo().getInfoTitle(),
            pm.questsTo().getInfoDescription(),
            pm.questsTo().getReferalLinkBox(),
            pm.questsTo().getXPHelpText()
        ]);

        // Ініціалізуємо лічильник розблокованих челленджів
        const unlockedCountRef = { current: 0 };

        // Налаштовуємо мокання API ОДИН РАЗ на початку (це ключовий момент!)
        console.log('🔧 Setting up API mocking ONCE...');
        await setupComprehensiveMocking(page, unlockedCountRef);

        await pm.questsTo().getQuestsPage().click();
        await expect(page).toHaveURL('https://dev.invest.penomo.com/campaigns?section=quests');

        // Пропускаємо туторіал
        console.log('⏭️ Skipping tutorial...');
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
        await checkVisibility([
            pm.questsTo().getActiveQuests(),
            pm.questsTo().getQuestsComplete(),
            pm.questsTo().getClaimedXP(),
            pm.questsTo().getCompletionProgress()
        ]);

        // Чекаємо, щоб елементи завантажилися
        await page.waitForSelector('.hexagon', { timeout: 10000 });

        // Отримуємо загальну кількість челленджів
        const allHexagons = page.locator('.hexagon');
        const totalChallenges = await allHexagons.count();
        console.log(`📊 Total challenges found: ${totalChallenges}`);

        // Перевіряємо поточний стан (без мокання повинно бути 0 завершених)
        const initialGreenHexagons = page.locator('.hexagon').filter({
            has: page.locator('svg.text-black')
        });
        const initialCompletedCount = await initialGreenHexagons.count();
        console.log(`📈 Initially completed challenges: ${initialCompletedCount}`);

        // Виконуємо челленджі один за одним
        const challengesToComplete = Math.min(5, totalChallenges);
        console.log(`🎯 Will complete ${challengesToComplete} challenges out of ${totalChallenges}`);

        await completeChallengesStepByStep(page, pm, challengesToComplete, unlockedCountRef);

        // Перевіряємо фінальний стан
        console.log(`✨ Verification: Completed ${challengesToComplete} challenges out of ${totalChallenges}`);

        // Фінальна перевірка кількості завершених челленджів
        await page.waitForTimeout(2000); // Чекаємо, щоб UI оновився

        const finalGreenHexagons = page.locator('.hexagon').filter({
            has: page.locator('svg.text-black')
        });
        const finalCompletedCount = await finalGreenHexagons.count();

        // Виводимо детальну інформацію для відладки
        console.log(`🔍 Final verification:`);
        console.log(`   - Expected completed: ${challengesToComplete}`);
        console.log(`   - Actually completed: ${finalCompletedCount}`);
        console.log(`   - Unlock counter: ${unlockedCountRef.current}`);

        // Перевіряємо результат
        expect(finalCompletedCount).toBeGreaterThanOrEqual(1); // Принаймні один челлендж має бути завершений
        console.log(`✅ Test passed: ${finalCompletedCount} challenges confirmed as completed`);

        // Додаткові перевірки UI елементів
        await checkVisibility([
            pm.questsTo().getActiveQuests(),
            pm.questsTo().getQuestsComplete(),
            pm.questsTo().getClaimedXP(),
            pm.questsTo().getCompletionProgress()
        ]);

        console.log('🎉 Test completed successfully!');
    });

    // Додатковий тест для відладки мокання
    test("Debug API mocking", async ({ page, context }) => {
        pm = new PageManager(page);

        await investorLogin(page, context, pm);
        await pm.dashboardTo().getCampaignsNav().click();

        const unlockedCountRef = { current: 2 };

        // Встановлюємо початковий мокінг
        await setupMockClaimReward(page);

        await pm.questsTo().getQuestsPage().click();
        await page.waitForTimeout(3000);

        await pm.questsTo().getSkipButton().click();
        await pm.questsTo().getNextButton().click();
        await pm.questsTo().getNextButton().click();
        await pm.questsTo().getLetsStartButton().click();

        for (let i = 2; i <= 10; i++) {
            console.log(`🔄 Processing quest iteration ${i}`);

            // Оновлюємо лічильник
            unlockedCountRef.current = i;

            // ВАЖЛИВО: Переустановлюємо мокінг після зміни unlockedCountRef
            await setupComprehensiveMocking(page, unlockedCountRef);

            // Перезавантажуємо сторінку для отримання нових даних
            await page.reload();
            await page.waitForTimeout(2000); // Збільшуємо час очікування

            // Шукаємо кнопки винагород
            const rewardButtons = await page.locator('svg.text-green-500').all();
            console.log(`🎯 Found ${rewardButtons.length} reward buttons for iteration ${i}`);

            for (const [buttonIndex, iconHandle] of rewardButtons.entries()) {
                try {
                    const clickable = await iconHandle.evaluateHandle(el => {
                        let current: HTMLElement | null = el as HTMLElement;
                        while (current && current.parentElement) {
                            current = current.parentElement as HTMLElement;
                            if (
                                current.tagName === 'BUTTON' ||
                                current.getAttribute('role') === 'button' ||
                                typeof (current as any).onclick === 'function'
                            ) {
                                return current;
                            }
                        }
                        return el;
                    });

                    await clickable.asElement()?.click();
                    await page.waitForTimeout(1500); // Збільшуємо час очікування між кліками
                    console.log(`✅ Claimed reward ${buttonIndex + 1} for quest iteration ${i}`);
                } catch (e) {
                    console.log(`⚠️ Failed to click reward ${buttonIndex + 1} for quest iteration ${i}:`, e);
                }
            }

            // Додаємо паузу між ітераціями
            await page.waitForTimeout(1000);
        }

        console.log('✅ Debug test completed');
        //console.log(`🏆 Final total points: ${totalPointsEarned}`);
        //console.log(`📋 Total claimed quests: ${questClaimStates.size}`);
    });
});