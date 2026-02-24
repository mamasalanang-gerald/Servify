-- Migration: Create provider_applications table
-- Purpose: Implement provider application system with admin review workflow

CREATE TABLE IF NOT EXISTS provider_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    business_name VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL CHECK (LENGTH(bio) >= 50),
    years_of_experience INTEGER NOT NULL CHECK (years_of_experience >= 0),
    service_categories INTEGER[] NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    service_address VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    reviewed_by UUID NULL REFERENCES users(id),
    rejection_reason TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_pending_application_per_user 
        EXCLUDE (user_id WITH =) WHERE (status = 'pending'),
    CONSTRAINT rejection_reason_required_when_rejected 
        CHECK (status != 'rejected' OR rejection_reason IS NOT NULL)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON provider_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON provider_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON provider_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_reviewed_by ON provider_applications(reviewed_by);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_provider_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_provider_applications_updated_at
    BEFORE UPDATE ON provider_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_provider_applications_updated_at();
