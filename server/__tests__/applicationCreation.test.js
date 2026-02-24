const fc = require('fast-check');
const pool = require('../config/DB');
const { createApplication, getApplicationById } = require('../models/applicationModel');
const { createUser, deleteUser } = require('../models/userModel');

// Feature: provider-application-system, Property 1: Valid Application Creation
// Validates: Requirements 1.2, 2.7
describe('Application Creation', () => {
    test('Property 1: Valid Application Creation - creating application with valid data should succeed', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    businessName: fc.string({ minLength: 2, maxLength: 100 }),
                    bio: fc.string({ minLength: 50, maxLength: 500 }),
                    yearsOfExperience: fc.integer({ min: 0, max: 50 }),
                    serviceCategories: fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 1, maxLength: 5 }),
                    phoneNumber: fc.string({ minLength: 10, maxLength: 20 }),
                    serviceAddress: fc.string({ minLength: 5, maxLength: 255 })
                }),
                async (applicationData) => {
                    let testUser = null;
                    let testApplication = null;
                    
                    try {
                        // Create a unique test user for each iteration
                        testUser = await createUser(
                            'Test User',
                            `test-${Date.now()}-${Math.random()}@example.com`,
                            'password123',
                            '1234567890'
                        );
                        
                        // Create application
                        testApplication = await createApplication(testUser.id, applicationData);
                        
                        // Verify application was created with correct data
                        const isValid = 
                            testApplication !== null &&
                            testApplication.user_id === testUser.id &&
                            testApplication.business_name === applicationData.businessName &&
                            testApplication.bio === applicationData.bio &&
                            testApplication.years_of_experience === applicationData.yearsOfExperience &&
                            JSON.stringify(testApplication.service_categories) === JSON.stringify(applicationData.serviceCategories) &&
                            testApplication.phone_number === applicationData.phoneNumber &&
                            testApplication.service_address === applicationData.serviceAddress &&
                            testApplication.status === 'pending' &&
                            testApplication.submitted_at !== null;
                        
                        // Clean up
                        if (testApplication) {
                            await pool.query('DELETE FROM provider_applications WHERE id = $1', [testApplication.id]);
                        }
                        if (testUser) {
                            await deleteUser(testUser.id);
                        }
                        
                        return isValid;
                    } catch (error) {
                        // Clean up on error
                        if (testApplication) {
                            try {
                                await pool.query('DELETE FROM provider_applications WHERE id = $1', [testApplication.id]);
                            } catch (e) {}
                        }
                        if (testUser) {
                            try {
                                await deleteUser(testUser.id);
                            } catch (e) {}
                        }
                        throw error;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
});

// Close pool after all tests
afterAll(async () => {
    await pool.end();
});
