-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    user_type TEXT NOT NULL DEFAULT 'client',
    phone_number VARCHAR(20),
    profile_image TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Create services table
CREATE TABLE IF NOT EXISTS services (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
category_id INT NOT NULL REFERENCES categories(id),
title VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('online', 'onsite')),
location VARCHAR(255) NULL,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id), 
    client_id UUID NOT NULL REFERENCES users(id),   
    provider_id UUID NOT NULL REFERENCES users(id), 
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    user_location VARCHAR NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id),
    provider_id UUID NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NULL,
    review_date TIMESTAMP DEFAULT NOW()
);
