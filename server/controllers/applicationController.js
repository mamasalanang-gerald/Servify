const { 
    submitApplication: submitApp, 
    getMyApplicationStatus 
} = require('../services/applicationService');

/**
 * Submit provider application
 * POST /api/applications
 */
const submitApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const applicationData = req.body;

        // Validate required fields
        const requiredFields = ['businessName', 'bio', 'yearsOfExperience', 'serviceCategories', 'phoneNumber', 'serviceAddress'];
        const missingFields = requiredFields.filter(field => !applicationData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                errors: missingFields.reduce((acc, field) => {
                    acc[field] = `${field} is required`;
                    return acc;
                }, {})
            });
        }

        const application = await submitApp(userId, applicationData);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application: {
                id: application.id,
                status: application.status,
                submittedAt: application.submitted_at
            }
        });
    } catch (error) {
        console.error('Submit application error:', error);

        // Handle validation errors
        if (error.message.startsWith('{')) {
            try {
                const errors = JSON.parse(error.message);
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
            } catch (e) {
                // Not a JSON error
            }
        }

        // Handle specific error messages
        if (error.message.includes('already have a pending application')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('Only clients can submit')) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        if (error.message.includes('can reapply after')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
};

/**
 * Get current user's application status
 * GET /api/applications/my-status
 */
const getMyStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const application = await getMyApplicationStatus(userId);

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        console.error('Get application status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve application status',
            error: error.message
        });
    }
};

module.exports = {
    submitApplication,
    getMyStatus
};
