/**
 * Notification Service Tests
 * Tests for notification sending functionality
 */

const notificationService = require('../services/notificationService');

describe('Notification Service', () => {
    // Mock console.log to avoid cluttering test output
    let consoleLogSpy;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    describe('sendApplicationSubmittedNotification', () => {
        it('should send notification when application is submitted', async () => {
            const userId = 123;

            await notificationService.sendApplicationSubmittedNotification(userId);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('Application submitted notification sent to user 123')
            );
        });

        it('should not throw error if notification fails', async () => {
            const userId = 456;

            // Should not throw
            await expect(
                notificationService.sendApplicationSubmittedNotification(userId)
            ).resolves.not.toThrow();
        });
    });

    describe('sendApplicationApprovedNotification', () => {
        it('should send notification when application is approved', async () => {
            const userId = 789;

            await notificationService.sendApplicationApprovedNotification(userId);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('Application approved notification sent to user 789')
            );
        });

        it('should not throw error if notification fails', async () => {
            const userId = 101;

            await expect(
                notificationService.sendApplicationApprovedNotification(userId)
            ).resolves.not.toThrow();
        });
    });

    describe('sendApplicationRejectedNotification', () => {
        it('should send notification when application is rejected', async () => {
            const userId = 202;
            const reason = 'Insufficient experience';

            await notificationService.sendApplicationRejectedNotification(userId, reason);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('Application rejected notification sent to user 202')
            );
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('Insufficient experience')
            );
        });

        it('should include rejection reason in notification', async () => {
            const userId = 303;
            const reason = 'Missing required documentation';

            await notificationService.sendApplicationRejectedNotification(userId, reason);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining(reason)
            );
        });

        it('should not throw error if notification fails', async () => {
            const userId = 404;
            const reason = 'Test reason';

            await expect(
                notificationService.sendApplicationRejectedNotification(userId, reason)
            ).resolves.not.toThrow();
        });
    });

    describe('Error handling', () => {
        it('should handle errors gracefully without throwing', async () => {
            // Mock console.error to verify error logging
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            // All notification methods should handle errors gracefully
            await expect(
                notificationService.sendApplicationSubmittedNotification(null)
            ).resolves.not.toThrow();

            await expect(
                notificationService.sendApplicationApprovedNotification(null)
            ).resolves.not.toThrow();

            await expect(
                notificationService.sendApplicationRejectedNotification(null, 'reason')
            ).resolves.not.toThrow();

            consoleErrorSpy.mockRestore();
        });
    });
});
