const fc = require('fast-check');
const pool = require('../config/DB');
const { createApplication } = require('../models/applicationModel');
const { createUser, deleteUser } = require('../models/userModel');

// Feature: provider-application-system, Property 21: Foreign Key Integrity
// Validates: Requirements 8.2
describe('Database Constraints - Foreign Key Integrity', () => {
    test('Property 21: Foreign Key Integrity - creating application with non-existent user_id should fail', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.uuid(),
                fc.record({
                    businessName: fc.string({ minLength: 2, maxLength: 100 }),
                    bio: fc.string({ minLength: 50, maxLength: 500 }),
                    yearsOfExperience: fc.integer({ min: 0, max: 50 }),
                    serviceCategories: fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 1, maxLength: 5 }),
                    phoneNumber: fc.string({ minLength: 10, maxLength: 20 }),
                    serviceAddress: fc.string({ minLength: 5, maxLength: 255 })
                }),
                async (nonExistentUserId, applicationData) => {
                    // Verify the user doesn't exist
                    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [nonExistentUserId]);
                    
                    // Only test if user doesn't exist
                    if (userCheck.rows.length === 0) {
                        try {
                            await createApplication(nonExistentUserId, applicationData);
                            // If we reach here, the test should fail
                            return false;
                        } catch (error) {
                            // Should throw a foreign key constraint error
                            return error.message.includes('foreign key') || 
                                   error.code === '23503'; // PostgreSQL foreign key violation code
                        }
                    }
                    return true; // Skip if user exists
                }
            ),
            { numRuns: 100 }
        );
    });
});

// Feature: provider-application-system, Property 22: User Deletion Prevention
// Validates: Requirements 8.3
describe('Database Constraints - User Deletion Prevention', () => {
    test('Property 22: User Deletion Prevention - deleting user with application should fail', async () => {
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
                        
                        // Create application for test user
                        testApplication = await createApplication(testUser.id, applicationData);
                        
                        // Try to delete the user
                        try {
                            await deleteUser(testUser.id);
                            // If deletion succeeds, the constraint is not working
                            return false;
                        } catch (error) {
                            // Should throw a foreign key constraint error (ON DELETE RESTRICT)
                            const isConstraintError = error.message.includes('foreign key') ||
                                                     error.message.includes('violates') ||
                                                     error.code === '23503';
                            
                            // Clean up
                            if (testApplication) {
                                await pool.query('DELETE FROM provider_applications WHERE id = $1', [testApplication.id]);
                            }
                            if (testUser) {
                                await deleteUser(testUser.id);
                            }
                            
                            return isConstraintError;
                        }
                    } catch (error) {
                        // Clean up on any error
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
