import { Route, Page } from '@playwright/test';

type Challenge = any;

// Виправлена функція для налаштування маршруту мокання
export async function mockChallengesRoute(page: Page, unlockedCountRef: { current: number }) {
    // Використовуємо більш точний шаблон URL
    await page.route('**/api/challenges/quests', async route => {
        console.log('🎯 Route intercepted:', route.request().url());

        const response = await route.fetch();
        const json = await response.json();

        console.log(`📊 Original challenges count: ${json.data.challengeDetails.length}`);
        console.log(`🔓 Unlocking ${unlockedCountRef.current} challenges`);

        // Модифікація challengeDetails з необхідними змінами
        json.data.challengeDetails = json.data.challengeDetails.map((challenge: any, index: number) => {
            const isChallengeType = /^CH\d+$/.test(challenge.challengeStaticId);
            const shouldBeCompleted = isChallengeType && index < unlockedCountRef.current;

            if (shouldBeCompleted) {
                console.log(`✅ Completing challenge ${index + 1}: ${challenge.challengeStaticId}`);
                return {
                    ...challenge,
                    isChallengeCompleted: true,
                    challengeCompletedAt: new Date().toISOString(),
                    isLocked: false,
                    // Розблоковуємо flipCards
                    flipCards: challenge.flipCards?.map((flip: any) => ({
                        ...flip,
                        isFlipCardLocked: false,
                        isFlipCardRevealed: true,
                        isFlipCardClaimed: false
                    })) || [],
                    // Додаємо completedSocialIds для імітації виконання
                    completedSocialIds: challenge.completedSocialIds?.length > 0
                        ? challenge.completedSocialIds
                        : [{
                            socialId: "mock_test_user",
                            platform: challenge.challengePlatform || "twitter",
                            completedAt: new Date().toISOString(),
                            _id: `mock_${Date.now()}_${index}`
                        }]
                };
            }
            return challenge;
        });

        await route.fulfill({
            status: response.status(),
            headers: {
                ...response.headers(),
                'content-type': 'application/json'
            },
            body: JSON.stringify(json)
        });
    });
}

// Альтернативна функція з більш широким перехопленням
export async function mockChallengesRouteWide(page: Page, unlockedCountRef: { current: number }) {
    // Перехоплюємо всі запити до API, що містять challenges/quests
    await page.route('**/*challenges/quests*', async route => {
        console.log('🎯 Wide route intercepted:', route.request().url());

        const response = await route.fetch();
        const json = await response.json();

        console.log(`📊 Processing ${json.data.challengeDetails.length} challenges`);
        console.log(`🔓 Unlocking first ${unlockedCountRef.current} challenges`);

        // Модифікація challengeDetails
        json.data.challengeDetails = json.data.challengeDetails.map((challenge: any, index: number) => {
            const shouldBeCompleted = index < unlockedCountRef.current;

            if (shouldBeCompleted) {
                console.log(`✅ Marking challenge ${index + 1} as completed: ${challenge.challengeStaticId}`);
                return {
                    ...challenge,
                    isChallengeCompleted: true,
                    challengeCompletedAt: new Date().toISOString(),
                    isLocked: false,
                    flipCards: challenge.flipCards?.map((flip: any) => ({
                        ...flip,
                        isFlipCardLocked: false,
                        isFlipCardRevealed: true,
                        isFlipCardClaimed: false
                    })) || [],
                    completedSocialIds: challenge.completedSocialIds?.length > 0
                        ? challenge.completedSocialIds
                        : [{
                            socialId: "auto_test_user",
                            platform: challenge.challengePlatform || "twitter",
                            completedAt: new Date().toISOString(),
                            _id: `auto_${Date.now()}_${index}`
                        }]
                };
            }
            return challenge;
        });

        await route.fulfill({
            status: response.status(),
            headers: {
                ...response.headers(),
                'content-type': 'application/json'
            },
            body: JSON.stringify(json)
        });
    });
}

// Функція для налаштування мокання з повним URL
export async function mockChallengesRouteExact(page: Page, unlockedCountRef: { current: number }) {
    const exactUrl = 'https://dev.api.penomo.com/api/challenges/quests';

    await page.route(exactUrl, async route => {
        console.log('🎯 Exact route intercepted:', route.request().url());

        const response = await route.fetch();
        const json = await response.json();

        console.log(`📊 Modifying ${json.data.challengeDetails.length} challenges`);
        console.log(`🔓 Setting ${unlockedCountRef.current} challenges as completed`);

        // Модифікація challengeDetails
        json.data.challengeDetails = json.data.challengeDetails.map((challenge: any, index: number) => {
            if (index < unlockedCountRef.current) {
                console.log(`✅ Challenge ${index + 1} (${challenge.challengeStaticId}) -> COMPLETED`);
                return {
                    ...challenge,
                    isChallengeCompleted: true,
                    challengeCompletedAt: new Date().toISOString(),
                    isLocked: false,
                    flipCards: challenge.flipCards?.map((flip: any) => ({
                        ...flip,
                        isFlipCardLocked: false,
                        isFlipCardRevealed: true,
                        isFlipCardClaimed: false
                    })) || [],
                    completedSocialIds: challenge.completedSocialIds?.length > 0
                        ? challenge.completedSocialIds
                        : [{
                            socialId: "exact_test_user",
                            platform: challenge.challengePlatform || "twitter",
                            completedAt: new Date().toISOString(),
                            _id: `exact_${Date.now()}_${index}`
                        }]
                };
            }
            return challenge;
        });

        await route.fulfill({
            status: response.status(),
            headers: {
                ...response.headers(),
                'content-type': 'application/json'
            },
            body: JSON.stringify(json)
        });
    });
}
export const claimState = { claimed: false };
export let totalPointsEarned = 0;
const POINTS_PER_CLAIM = 500;

// Додаємо мапу для відстеження стану кожного квесту
const questClaimStates = new Map();

export function resetPointsCounter() {
    totalPointsEarned = 0;
    claimState.claimed = false;
    questClaimStates.clear(); // Очищуємо стани всіх квестів
    console.log('🔄 Points counter and claim state reset');
}

export async function setupComprehensiveMocking(page: Page, unlockedCountRef: { current: number }) {
    console.log('🔧 Setting up comprehensive route mocking...');

    await page.route('**/api/challenges/quests', async route => {
        const url = route.request().url();
        if (!url.includes('usertracking')) {
            console.log(`🎯 Route intercepted: ${url}`);
            const currentUnlockCount = unlockedCountRef.current;
            console.log(`🔓 Current unlock count: ${currentUnlockCount}`);

            const response = await route.fetch();
            const json = await response.json();

            console.log(`📊 Original data - ${json.data.challengeDetails.length} challenges`);

            json.data.challengeDetails = json.data.challengeDetails.map((challenge: any, index: number) => {
                const questKey = `${challenge.challengeStaticId}_${index}`;

                if (index < currentUnlockCount) {
                    console.log(`✅ Mocking challenge ${index + 1}: ${challenge.challengeStaticId} as COMPLETED`);

                    // Перевіряємо, чи цей квест вже був claimed
                    const isAlreadyClaimed = questClaimStates.get(questKey) || false;

                    return {
                        ...challenge,
                        isChallengeCompleted: true,
                        challengeCompletedAt: new Date().toISOString(),
                        isLocked: false,
                        flipCards: challenge.flipCards?.map((flip: any, flipIndex: number) => ({
                            ...flip,
                            isFlipCardLocked: false,
                            isFlipCardRevealed: true,
                            isFlipCardClaimed: isAlreadyClaimed // Використовуємо індивідуальний стан
                        })) || [],
                        completedSocialIds: challenge.completedSocialIds?.length > 0
                            ? challenge.completedSocialIds
                            : [{
                                socialId: "test_user_mock",
                                platform: challenge.challengePlatform || "twitter",
                                completedAt: new Date().toISOString(),
                                _id: `mock_${Date.now()}_${index}`
                            }]
                    };
                } else {
                    return challenge;
                }
            });

            console.log(`🎁 Modified data sent to client`);
            console.log(`💰 Total points earned so far: ${totalPointsEarned}`);

            await route.fulfill({
                status: response.status(),
                headers: {
                    ...response.headers(),
                    'content-type': 'application/json'
                },
                body: JSON.stringify(json)
            });
        } else {
            route.continue();
        }
    });
}

export async function setupMockClaimReward(page: Page) {
    console.log('🔧 Setting up mock for reward claim...');

    await page.route('**/quests/flipCards/reveal/claim**', async route => {
        const url = route.request().url();
        const postData = route.request().postDataJSON?.() || {};

        console.log(`🎁 Mocking PATCH reward claim: ${url}`);
        console.log(`📝 Request data:`, postData);

        const coinsRewarded = POINTS_PER_CLAIM;
        totalPointsEarned += coinsRewarded;

        // Зберігаємо стан claim для конкретного квесту
        const questKey = `${postData?.challengeId}_${postData?.flipCardId}`;
        questClaimStates.set(questKey, true);

        console.log(`💰 Coins rewarded: ${coinsRewarded}`);
        console.log(`🏆 Total points earned: ${totalPointsEarned}`);
        console.log(`📋 Claimed quests: ${questClaimStates.size}`);

        claimState.claimed = true; // Глобальний стан для сумісності

        await route.fulfill({
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                ok: true,
                code: 200,
                message: "Reward claimed successfully",
                data: {
                    coinsRewarded: coinsRewarded,
                    challengeId: postData?.challengeId,
                    flipCardId: postData?.flipCardId,
                    pointsAwarded: coinsRewarded,
                    totalPointsEarned: totalPointsEarned
                }
            })
        });
    });

    await page.route('**/api/challenges/quests/usertracking', async route => {
        console.log(`📊 Mocking usertracking request`);
        console.log(`💎 Current total points: ${totalPointsEarned}`);

        await route.fulfill({
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                ok: true,
                code: 200,
                message: "Challenge retrieved successfully",
                data: {
                    claimedPoint: totalPointsEarned,
                    completionPercentage: Math.min(Math.floor((totalPointsEarned / POINTS_PER_CLAIM) * 10), 100),
                    questCompleted: Math.floor(totalPointsEarned / POINTS_PER_CLAIM),
                    totalQuest: 10,
                    activeQuest: Math.max(10 - Math.floor(totalPointsEarned / POINTS_PER_CLAIM), 0),
                    totalFlipCardPoints: 516496770
                }
            })
        });
    });
}
// Спрощена функція для поступового завершення челленджів
export async function completeChallengesStepByStep(page: Page, pm: any, totalChallenges: number, unlockedCountRef: { current: number }) {
    console.log(`🚀 Starting step-by-step completion of ${totalChallenges} challenges`);

    for (let i = 0; i < totalChallenges; i++) {
        console.log(`\n📍 Step ${i + 1}/${totalChallenges}: Unlocking challenge ${i + 1}`);

        // Збільшуємо кількість розблокованих челленджів
        unlockedCountRef.current = i + 1;
        console.log(`🔓 Updated unlock count to: ${unlockedCountRef.current}`);

        // НЕ налаштовуємо мокання заново! Воно вже налаштоване і використовує референс

        // Перезавантажуємо сторінку для нового запиту до API
        console.log('🔄 Reloading page to trigger new API call...');
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Чекаємо поки з'являться елементи квестів
        await page.waitForSelector('.hexagon', { timeout: 10000 });
        await page.waitForTimeout(2000); // Збільшуємо час очікування

        // Перевіряємо кількість завершених челленджів
        const greenHexagons = page.locator('.hexagon').filter({
            has: page.locator('svg.text-black')
        });

        const currentCompletedCount = await greenHexagons.count();
        console.log(`✅ Current completed challenges on UI: ${currentCompletedCount}`);
        console.log(`🎯 Expected completed challenges: ${unlockedCountRef.current}`);

        if (currentCompletedCount !== unlockedCountRef.current) {
            console.warn(`⚠️ MISMATCH: Expected ${unlockedCountRef.current}, got ${currentCompletedCount}`);
        }

        // Якщо є завершені челленджі, працюємо з ними
        if (currentCompletedCount > 0) {
            // Клікаємо на останній завершений челлендж
            const targetIndex = Math.min(i, currentCompletedCount - 1);
            const targetHexagon = greenHexagons.nth(targetIndex);

            await targetHexagon.scrollIntoViewIfNeeded();
            await targetHexagon.click();

            console.log(`👆 Clicked on challenge at index ${targetIndex}`);
            await page.waitForTimeout(1500);

            // Шукаємо і клікаємо на flip cards та нагороди
            const rewardSelectors = [
                '[data-testid="flip-card"]',
                '.flip-card',
                '.reward-card',
                'svg.text-green-500:not(.claimed):not(.disabled)',
                '[class*="flip"]:not(.claimed):not(.disabled)'
            ];

            let totalRewardsClaimed = 0;

            for (const selector of rewardSelectors) {
                try {
                    const elements = page.locator(selector);
                    const count = await elements.count();

                    if (count > 0) {
                        console.log(`🎁 Found ${count} potential rewards with selector: ${selector}`);

                        for (let j = 0; j < count; j++) {
                            try {
                                const element = elements.nth(j);
                                if (await element.isVisible({ timeout: 1000 })) {
                                    await element.click();
                                    totalRewardsClaimed++;
                                    console.log(`🎉 Claimed reward ${totalRewardsClaimed}`);
                                    await page.waitForTimeout(500);
                                }
                            } catch (error) {
                                // Елемент може бути недоступний для кліку
                            }
                        }
                    }
                } catch (error) {
                    // Продовжуємо з наступним селектором
                }
            }

            console.log(`🏆 Total rewards claimed in this step: ${totalRewardsClaimed}`);

            // Закриваємо модальне вікно
            await closeModalWindow(page);
        }

        // Пауза між кроками
        await page.waitForTimeout(1500);
    }

    console.log(`🎯 Completed processing ${totalChallenges} challenges`);
}

// Допоміжна функція для закриття модального вікна
async function closeModalWindow(page: Page) {
    const closeSelectors = [
        'button[aria-label="Close"]',
        'button:has-text("Close")',
        '[data-testid="close-button"]',
        '.modal-close',
        'button:has([class*="close"])',
        '[role="dialog"] button',
        '.modal button'
    ];

    for (const selector of closeSelectors) {
        try {
            const closeButton = page.locator(selector);
            if (await closeButton.count() > 0) {
                const firstButton = closeButton.first();
                if (await firstButton.isVisible({ timeout: 1000 })) {
                    await firstButton.click();
                    console.log(`🚪 Closed modal with selector: ${selector}`);
                    await page.waitForTimeout(500);
                    return;
                }
            }
        } catch (error) {
            // Продовжуємо з наступним селектором
        }
    }

    // Якщо нічого не спрацювало, пробуємо ESC
    try {
        await page.keyboard.press('Escape');
        console.log('🚪 Closed modal with ESC key');
        await page.waitForTimeout(500);
    } catch (error) {
        console.log('ℹ️ No modal to close or failed to close');
    }
}

// Функція для відладки - показує всі перехоплені запити
export async function debugAllRequests(page: Page) {
    await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.includes('challenges') || url.includes('quests')) {
            console.log('🔍 DEBUG - Request intercepted:', url);
        }
        route.continue();
    });
}