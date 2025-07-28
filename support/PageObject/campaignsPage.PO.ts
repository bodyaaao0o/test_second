import { Page, Locator } from '@playwright/test'

export class CampaignsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    };

    getCampaignsNavBar(): Locator {
        return this.page.locator('ul.flex.flex-wrap.-mb-px');
    };

    getInfoPage(): Locator {
        return this.page.locator('span', { hasText: "Info" });
    };

    getQuestsPage(): Locator {
        return this.page.locator('span.inline-block', { hasText: "Quests" });
    };

    getLeaderboardPage(): Locator {
        return this.page.locator('span.inline-block', { hasText: 'Leaderboard' });
    };

    //Info page

    getInfoTitle(): Locator {
        return this.page.locator('h1', { hasText: "Earn XP* by referring penomo to " });
    };

    getInfoDescription(): Locator {
        return this.page.locator('p', { hasText: "250 XP will be claimed after your referee has completed a successful KYC on penomo. Another 1000 XP will be claimed after the presale, if your referee has invested in the PNMO presale" });
    };

    getReferalLinkBox(): Locator {
        return this.page.locator('button[aria-label="Copy referral link"]').locator('..'); // отримує батьківський div
    }



    getXPHelpText(): Locator {
        return this.page.locator('p', { hasText: "*Your XP will be converted into PNMO tokens in the future." });
    };

    //Quests page

    getSkipButton(): Locator {
        return this.page.locator('button', { hasText: "Skip" });
    };

    getCompleteYourTasks(): Locator {
        return this.page.locator('.flex.flex-col.items-center.justify-center', { hasText: "Complete Your Tasks" });
    };

    getCompleteYourTasksDescription(): Locator {
        return this.page.locator('.text-center.leading-normal.text-monochrome-20.text-xs', {
            hasText: "Clicking on the Green Core reveal your task to complete Finish the task to earn XP and unlock Quantum Cores"
        });
    };

    getCompleteYourTasksVideoHelp(): Locator {
        return this.page.locator('video[src="/assets/step1.mp4"]');
    };

    getBackButton(): Locator {
        return this.page.locator('button', { hasText: "Back" });
    };

    getNextButton(): Locator {
        return this.page.locator('button', { hasText: "Next" });
    };

    getQuantumCoresPage(): Locator {
        return this.page.locator('.flex.flex-col.items-center.justify-center', { hasText: "Quantum Cores" });
    };

    getQuantumCoresDescription(): Locator {
        return this.page.locator('.text-center.leading-normal.text-monochrome-20.text-xs', { hasText: "Completing a task will unlock Quantum Cores that can give you Bonus XP. BUT..." })
    };

    getQuantumCoresVideo(): Locator {
        return this.page.locator('video[src="/assets/step2.mp4"]');
    };

    getBewareOfDoomCoresPage(): Locator {
        return this.page.locator('.flex.flex-col.items-center.justify-center', { hasText: "Beware of Doom Cores " });
    };

    getBewareOfDoomCoresDescription(): Locator {
        return this.page.locator('.text-center.leading-normal.text-monochrome-20.text-xs', { hasText: 'Sometimes, Quantum Cores collapse creating red XP traps.' });
    };

    getBewareOfDoomCoresVideo(): Locator {
        return this.page.locator('video[src="/assets/step3.mp4"]');
    };

    getLetsStartButton(): Locator {
        return this.page.locator('button', { hasText: "Let's Start" });
    };

    getActiveQuests(): Locator {
        return this.page.locator('div.flex.flex-col.body-medium', { hasText: "ACTIVE QUESTS" });
    };

    getQuestsComplete(): Locator {
        return this.page.locator('div.flex.flex-col.body-medium', { hasText: "QUESTS COMPLETED" });
    };

    getClaimedXP(): Locator {
        return this.page.locator('div.flex.flex-col.body-medium', { hasText: "CLAIMED XP" });
    };

    getCompletionProgress(): Locator {
        return this.page.locator('div.flex.flex-col.body-medium', { hasText: "COMPLETION PROGRESS" });
    };

    getQuestMessage(): Locator {
        return this.page.locator('.p-4.rounded-lg', {
            has: this.page.locator('button'),
            hasText: 'Challenge '
        });
    };

    getChallengeButton(): Locator {
        return this.page.locator('button.py-2.px-2.md:px-6.flex.flex-row.items-center.cursor-pointer.justify-center', { hasText: "Challenge" })
    };

    getQuests(): Locator {
        return this.page.locator('svg.text-black');
    };

    getFollowUsOnXQuest(): Locator {
        return this.page.getByText('Follow us on X');
    };

    getFollowUsOnXQuestDescription(): Locator {
        return this.page.locator('div.flex.items-center.gap-4', { hasText: "Complete the challenge by following the official penomo account on X!" });
    };

    getCloseQuestButton(): Locator {
        return this.page.locator('button.bg-monochrome-60').first();
    };

    getJoinTelegramQuest(): Locator {
        return this.page.getByText('Join Telegram');
    };

    getJoinTelegramQuestDescription(): Locator {
        return this.page.locator('div.flex.items-center.gap-4', { hasText: "Complete the challenge by joining the penomo Telegram group!" });
    };

    getJoinDiscordQuest(): Locator {
        return this.page.getByText('Join Discord');
    };

    getJoinDiscordQuestDescription(): Locator {
        return this.page.locator('div.flex.items-center.gap-4', { hasText: "Complete the challenge by joining the official penomo Discord!" });
    };

    getRetweetOnXQuest(): Locator {
        return this.page.locator('h2.mb-0.font-semibold', { hasText: "Retweet on X" });
    };

    getRetweetOnXQuestDescription(): Locator {
        return this.page.locator('div.flex.items-center.gap-4', { hasText: "Complete the challenge by retweeting the following post on X!" });
    };


    //Leaderboard

    getYourRank(): Locator {
        return this.page.locator('.p-4.flex.gap-10.flex-col.rounded.bg-green-500', {hasText: "your rank"});
    };

    getYourPoints(): Locator {
        return this.page.locator('.p-4.rounded.border.border-green-30.h-full', {hasText: "your points"});
    };

    getQuestsCompleted(): Locator {
        return this.page.locator('.p-4.flex.flex-col.gap-10.rounded.border.border-green-30.h-full', {hasText: "quests completed"});
    };

    getLeaderboard(): Locator {
        return this.page.locator('.relative.flex.flex-col').nth(1);
    };

    getLeadersLines(): Locator {
        return this.page.locator('div.flex.p-4.items-center.text-white.border-b.border-green-30');
    };

    getLineCountBox(): Locator {
        return this.page.locator('.flex.gap-3.items-center', {hasText: "Items per page"});
    };

    get25LeadersPerPage(): Locator {
        return this.page.locator('li.py-1.px-2', {hasText: "25"})
    };

    get50LeadersPerPage(): Locator {
        return this.page.locator('li.py-1.px-2', {hasText: "50"});
    };

    get10LeaderPerPage(): Locator {
        return this.page.locator('li.py-1.px-2', {hasText: "10"}).nth(0);
    };

    get100LeaderPerPage(): Locator {
        return this.page.locator('li.py-1.px-2', {hasText: "100"});
    };

    getPageNumbersBox(): Locator {
        return this.page.locator(".flex.items-center.gap-2").nth(1);
    };

    getLeftButton(): Locator {
        return this.page.locator('button:has(svg.text-green-500)').nth(0);
    };

    getRightButton(): Locator {
        return this.page.locator('button:has(svg.text-green-500)').nth(1);
    };

    getPageNumber(): Locator {
        return this.page.locator('input.outline-none.rounded-lg');
    };




}