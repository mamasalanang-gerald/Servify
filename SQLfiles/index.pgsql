CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);
