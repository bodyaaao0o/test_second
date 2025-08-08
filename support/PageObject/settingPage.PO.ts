import { Page, Locator } from '@playwright/test'

export class SettingPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    };

    getAccountPage(): Locator {
        return this.page.locator(".cursor-pointer.font-sm.bg-monochrome-100", { hasText: "Account" });
    }

    getNotificationPage(): Locator {
        return this.page.locator(".cursor-pointer.font-sm", { hasText: 'Notifications' });
    }


    getAccountTitle(): Locator {
        return this.page.locator('h4', { hasText: "Account" });
    };

    getUserDetailsTitle(): Locator {
        return this.page.locator('h3', { hasText: "Basic Details" });
    };

    getUserDetailsDescription(): Locator {
        return this.page.locator('p', { hasText: "Manage essential account information" });
    };

    getFirstNameTitle(): Locator {
        return this.page.locator('label', { hasText: "First Name" });
    };

    getFirstNameInput(): Locator {
        return this.page.locator('input[placeholder="Enter your first name here"]');
    };

    getChangeFirstName(): Locator {
        return this.page.locator('div.cursor-pointer svg').nth(2);
    }


    getSaveChangesNames(): Locator {
        return this.page.locator('.absolute.right-2.cursor-pointer.text-green-100', { hasText: "Save" }).nth(0)
    }

    getLastNameTitle(): Locator {
        return this.page.locator('label', { hasText: "Last Name" });
    };

    getLastNameInput(): Locator {
        return this.page.locator('input[placeholder="Enter your last name here"]');
    };

    getChangeLastName(): Locator {
        return this.page.locator('div.cursor-pointer svg').nth(3);
    };

    getEmailTitle(): Locator {
        return this.page.locator('label', { hasText: "Email" });
    };

    getEmailInput(): Locator {
        return this.page.locator('input[placeholder="Enter your email here"]');
    };

    getKYCStatucTitle(): Locator {
        return this.page.locator('label', { hasText: "KYC Status" });
    };

    getKYCStatus(): Locator {
        return this.page.locator('span', { hasText: "Not Submitted" });
    };

    getWalletDetailsTitle(): Locator {
        return this.page.locator('h3', { hasText: 'Wallet Details' });
    };

    getWalletAddressDescription(): Locator {
        return this.page.locator('label', { hasText: "Penomo Platform Wallet Address" });
    };

    getWalletAddress(): Locator {
        return this.page.locator('.flex.items-center.gap-4.justify-start').nth(0);
    };

    getCopyWalletAddressButton(): Locator {
        return this.page.locator('.text-monochrome-20.cursor-pointer').nth(0);
    };

    getReferralLinkTitle(): Locator {
        return this.page.locator('h3', { hasText: "Referral Link" });
    };

    getReferralLinkDescription(): Locator {
        return this.page.locator('p', { hasText: "Share this link to invite friends" });
    };

    getLinkDescription(): Locator {
        return this.page.locator('label', { hasText: "Referral Link" });
    };

    getReferalLink(): Locator {
        return this.page.locator('.flex.items-center.gap-4.justify-start').nth(1);
    };

    getCopyReferalLinkButton(): Locator {
        return this.page.locator('.text-monochrome-20.cursor-pointer').nth(1);
    };

    getCompleteKYCBox(): Locator {
        return this.page.locator('section', { hasText: 'Complete KYC' }).nth(1);
    }


    getCompleteKYCTitle(): Locator {
        return this.page.locator('h4', { hasText: "Complete KYC" });
    };

    getCompleteKYCDescription(): Locator {
        return this.page.locator('p', { hasText: "Complete your KYC to access the complete platform." });
    };

    getStartKYCButton(): Locator {
        return this.page.locator('button', { hasText: "Start" });
    };

    getDeleteAccountButton(): Locator {
        return this.page.locator('button', { hasText: "Delete Account" });
    };

    getDeleteAccountBox(): Locator {
        return this.page.locator('.flex-1.overflow-auto.p-6.bg-monochrome-100');
    };

    getDeleteAccountTitle(): Locator {
        return this.page.locator('h2', { hasText: "Delete Account" });
    };

    getDeleteAccountDescription(): Locator {
        return this.page.locator('p', { hasText: "Are you sure you want to delete your account? This action cannot be undone." });
    };

    getCanselDeleteButton(): Locator {
        return this.page.locator('button', { hasText: "Cancel" });
    };

    getConfirmDeleteButton(): Locator {
        return this.page.locator('button', { hasText: "Delete" }).nth(1);
    };

    //Notifications
    getNotificationsTitle(): Locator {
        return this.page.locator('h3.text-monochrome-20', { hasText: "Notifications" });
    };

    getEmailNotifications(): Locator {
        return this.page.locator('h3', { hasText: "Email Notifications" });
    };

    getEmailNotificationsDescription(): Locator {
        return this.page.locator('p', { hasText: "Manage your preferences for receiving email notifications" });
    };

    getNotificationSwitch(): Locator {
        return this.page.locator('.react-switch-bg');
    };

    getNotificationSwitchDescription(): Locator {
        return this.page.locator('div.flex.items-center.gap-2', { hasText: "Receive Email Notifications" });
    };

    getSuccessUpdateNotificationMessage(): Locator {
        return this.page.locator('.go3958317564', { hasText: "Email notification setting updated successfully!" });
    };

    getSuccessUpdateUserDataMessage(): Locator {
        return this.page.locator('.go2072408551', { hasText: "User details updated successfully" });
    };

    getAddressCopiedMessage(): Locator {
        return this.page.locator('.go2072408551', { hasText: "Address copied to clipboard!" });
    };

    getReferalLinkCopiedMessage(): Locator {
        return this.page.locator('.go2072408551', { hasText: "Referral link copied to clipboard!" });
    };


}
