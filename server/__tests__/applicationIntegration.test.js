/**
 * Application Integration Tests
 * End-to-end tests for the provider application system
 */

const pool = require('../config/DB');
const { submitApplication, approveApplication, rejectApplication, getMyApplicationStatus } = require('../services/applicationService');
const { createUser, getUserById } = require('../models/userModel');
const { getApplicationByUserId } = require('../models/applicationModel');

describe('Application Integration Tests', () => {
    let testClientId;
    let testAdminId;
    let testApplicationId;

    beforeAll(async () => {
        // Create test users
        const clientResult = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, user_type) 
             VALUES ($1, $2, $3, $4) RETURNING id`,
            ['Test Client', 'integration.client@test.com', 'hashedpassword', 'client']
        );
        testClientId = clientResult.rows[0].id;

        const adminResult = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, user_type) 
             VALUES ($1, $2, $3, $4) RETURNING id`,
            ['Test Admin', 'integration.admin@test.com', 'hashedpassword', 'admin']
        );
        testAdminId = adminResult.rows[0].id;
    });

    afterAll(async () => {
        // Clean up test data
        await pool.query('DELETE FROM provider_applications WHERE user_id = $1', [testClientId]);
        await pool.query('DELETE FROM users WHERE id IN ($1, $2)', [testClientId, testAdminId]);
        await pool.end();
    });

    describe('End-to-end Application Submission Flow', () => {
        it('should complete full application submission flow', async () => {
            // Step 1: Submit application
            const applicationData = {
                businessName: 'Integration Test Business',
                bio: 'This is a test bio with more than fifty characters to meet the minimum requirement.',
                yearsOfExperience: 5,
                serviceCategories: [1, 2],
                phoneNumber: '+63 900 000 0000',
                serviceAddress: '123 Test Street, Test City'
            };

            const application = await submitApplication(testClientId, applicationData);

            expect(application).toBeDefined();
            expect(application.status).toBe('pending');
            expect(application.business_name).toBe(applicationData.businessName);
            testApplicationId = application.id;

            // Step 2: Verify application status
            const status = await getMyApplicationStatus(testClientId);
            expect(status).toBeDefined();
            expect(status.status).toBe('pending');
            expect(status.canReapply).toBe(false);

            // Step 3: Verify user is still a client
            const user = await getUserById(testClientId);
            expect(user.user_type).toBe('client');
        });

        it('should prevent duplicate pending applications', async () => {
            const applicationData = {
                businessName: 'Duplicate Test',
                bio: 'This is another test bio with more than fifty characters.',
                yearsOfExperience: 3,
                serviceCategories: [1],
                phoneNumber: '+63 900 000 0001',
                serviceAddress: '456 Test Avenue'
            };

            await expect(
                submitApplication(testClientId, applicationData)
            ).rejects.toThrow('You already have a pending application');
        });
    });

    describe('End-to-end Approval Flow', () => {
        it('should complete full approval flow', async () => {
            // Step 1: Approve application
            const approvedApp = await approveApplication(testApplicationId, testAdminId);

            expect(approvedApp).toBeDefined();
            expect(approvedApp.status).toBe('approved');
            expect(approvedApp.reviewed_by).toBe(testAdminId);
            expect(approvedApp.reviewed_at).toBeDefined();

            // Step 2: Verify user is promoted to provider
            const user = await getUserById(testClientId);
            expect(user.user_type).toBe('provider');
            // Note: Profile fields (bio, experience, address) are updated in the database
            // but may not be returned by getUserById depending on the model implementation

            // Step 3: Verify application status
            const status = await getMyApplicationStatus(testClientId);
            expect(status.status).toBe('approved');
        });

        it('should prevent approving already processed application', async () => {
            await expect(
                approveApplication(testApplicationId, testAdminId)
            ).rejects.toThrow('Application has already been processed');
        });
    });

    describe('End-to-end Rejection Flow', () => {
        let rejectionTestClientId;
        let rejectionTestApplicationId;

        beforeAll(async () => {
            // Create another test client for rejection flow
            const clientResult = await pool.query(
                `INSERT INTO users (full_name, email, password_hash, user_type) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                ['Rejection Test Client', 'rejection.client@test.com', 'hashedpassword', 'client']
            );
            rejectionTestClientId = clientResult.rows[0].id;

            // Submit application
            const applicationData = {
                businessName: 'Rejection Test Business',
                bio: 'This is a test bio for rejection flow with more than fifty characters.',
                yearsOfExperience: 2,
                serviceCategories: [1],
                phoneNumber: '+63 900 000 0002',
                serviceAddress: '789 Test Road'
            };

            const application = await submitApplication(rejectionTestClientId, applicationData);
            rejectionTestApplicationId = application.id;
        });

        afterAll(async () => {
            await pool.query('DELETE FROM provider_applications WHERE user_id = $1', [rejectionTestClientId]);
            await pool.query('DELETE FROM users WHERE id = $1', [rejectionTestClientId]);
        });

        it('should complete full rejection flow', async () => {
            const rejectionReason = 'Insufficient experience for selected service categories';

            // Step 1: Reject application
            const rejectedApp = await rejectApplication(
                rejectionTestApplicationId,
                testAdminId,
                rejectionReason
            );

            expect(rejectedApp).toBeDefined();
            expect(rejectedApp.status).toBe('rejected');
            expect(rejectedApp.rejection_reason).toBe(rejectionReason);
            expect(rejectedApp.reviewed_by).toBe(testAdminId);

            // Step 2: Verify user is still a client
            const user = await getUserById(rejectionTestClientId);
            expect(user.user_type).toBe('client');

            // Step 3: Verify application status shows rejection
            const status = await getMyApplicationStatus(rejectionTestClientId);
            expect(status.status).toBe('rejected');
            expect(status.rejectionReason).toBe(rejectionReason);
            expect(status.canReapply).toBe(false); // Within 30 days
        });

        it('should prevent reapplication within 30 days', async () => {
            const applicationData = {
                businessName: 'Reapplication Test',
                bio: 'Attempting to reapply immediately after rejection with sufficient characters.',
                yearsOfExperience: 5,
                serviceCategories: [1],
                phoneNumber: '+63 900 000 0003',
                serviceAddress: '321 Test Lane'
            };

            await expect(
                submitApplication(rejectionTestClientId, applicationData)
            ).rejects.toThrow(/You can reapply after/);
        });

        it('should allow reapplication after 30 days', async () => {
            // Simulate 31 days passing by updating the reviewed_at date
            await pool.query(
                `UPDATE provider_applications 
                 SET reviewed_at = NOW() - INTERVAL '31 days'
                 WHERE id = $1`,
                [rejectionTestApplicationId]
            );

            // Verify can reapply
            const status = await getMyApplicationStatus(rejectionTestClientId);
            expect(status.canReapply).toBe(true);

            // Submit new application
            const applicationData = {
                businessName: 'Reapplication After 30 Days',
                bio: 'This is a reapplication after the waiting period with sufficient characters.',
                yearsOfExperience: 6,
                serviceCategories: [1, 2],
                phoneNumber: '+63 900 000 0004',
                serviceAddress: '654 Test Boulevard'
            };

            const newApplication = await submitApplication(rejectionTestClientId, applicationData);
            expect(newApplication).toBeDefined();
            expect(newApplication.status).toBe('pending');

            // Clean up
            await pool.query('DELETE FROM provider_applications WHERE id = $1', [newApplication.id]);
        });
    });

    describe('Concurrent Application Submissions', () => {
        let concurrentTestClientId;

        beforeAll(async () => {
            const clientResult = await pool.query(
                `INSERT INTO users (full_name, email, password_hash, user_type) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                ['Concurrent Test Client', 'concurrent.client@test.com', 'hashedpassword', 'client']
            );
            concurrentTestClientId = clientResult.rows[0].id;
        });

        afterAll(async () => {
            await pool.query('DELETE FROM provider_applications WHERE user_id = $1', [concurrentTestClientId]);
            await pool.query('DELETE FROM users WHERE id = $1', [concurrentTestClientId]);
        });

        it('should handle concurrent application submissions correctly', async () => {
            const applicationData = {
                businessName: 'Concurrent Test Business',
                bio: 'Testing concurrent submissions with more than fifty characters in the bio.',
                yearsOfExperience: 4,
                serviceCategories: [1],
                phoneNumber: '+63 900 000 0005',
                serviceAddress: '987 Test Circle'
            };

            // Attempt to submit two applications simultaneously
            const promises = [
                submitApplication(concurrentTestClientId, applicationData),
                submitApplication(concurrentTestClientId, applicationData)
            ];

            const results = await Promise.allSettled(promises);

            // One should succeed, one should fail
            const succeeded = results.filter(r => r.status === 'fulfilled');
            const failed = results.filter(r => r.status === 'rejected');

            expect(succeeded.length).toBe(1);
            expect(failed.length).toBe(1);
            expect(failed[0].reason.message).toContain('pending application');
        });
    });
});
