ALTER TABLE services ADD COLUMN IF NOT EXISTS packages JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT NULL;

CREATE TABLE IF NOT EXISTS saved_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_services_user ON saved_services(user_id);

ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience VARCHAR(50) NULL;


