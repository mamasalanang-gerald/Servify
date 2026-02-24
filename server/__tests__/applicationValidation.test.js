const { validateApplicationData } = require('../utils/applicationValidation');

// Feature: provider-application-system, Property 2: Required Field Validation
// Validates: Requirements 1.3, 2.1
describe('Application Validation - Required Fields', () => {
    test('Property 2: Required Field Validation - missing businessName should fail', () => {
        const data = {
            bio: 'A'.repeat(50),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.businessName).toBeDefined();
    });

    test('Property 2: Required Field Validation - missing bio should fail', () => {
        const data = {
            businessName: 'Test Business',
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.bio).toBeDefined();
    });

    test('Property 2: Required Field Validation - all fields present should pass required validation', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(true);
    });
});

// Feature: provider-application-system, Property 3: Bio Length Validation
// Validates: Requirements 2.2
describe('Application Validation - Bio Length', () => {
    test('Property 3: Bio Length Validation - bio with 49 characters should fail', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(49),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.bio).toBeDefined();
    });

    test('Property 3: Bio Length Validation - bio with 50 characters should pass', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(true);
    });

    test('Property 3: Bio Length Validation - bio with 100 characters should pass', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(100),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(true);
    });
});

// Feature: provider-application-system, Property 4: Experience Validation
// Validates: Requirements 2.3
describe('Application Validation - Years of Experience', () => {
    test('Property 4: Experience Validation - negative years should fail', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: -1,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.yearsOfExperience).toBeDefined();
    });

    test('Property 4: Experience Validation - zero years should pass', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: 0,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(true);
    });

    test('Property 4: Experience Validation - positive years should pass', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: 10,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(true);
    });
});

// Feature: provider-application-system, Property 5: Phone Number Format Validation
// Validates: Requirements 2.5
describe('Application Validation - Phone Number Format', () => {
    test('Property 5: Phone Number Format Validation - invalid phone with letters should fail', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: 'abc123',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.phoneNumber).toBeDefined();
    });

    test('Property 5: Phone Number Format Validation - too short phone should fail', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '123',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors.phoneNumber).toBeDefined();
    });

    test('Property 5: Phone Number Format Validation - valid 10 digit phone should pass', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '1234567890',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(true);
    });

    test('Property 5: Phone Number Format Validation - valid formatted phone should pass', () => {
        const data = {
            businessName: 'Test Business',
            bio: 'A'.repeat(50),
            yearsOfExperience: 5,
            serviceCategories: [1, 2],
            phoneNumber: '+1 (555) 123-4567',
            serviceAddress: '123 Main St'
        };
        
        const result = validateApplicationData(data);
        expect(result.isValid).toBe(true);
    });
});
