CREATE TABLE users (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
full_name VARCHAR(100) NOT NULL ,
email VARCHAR(150) UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
user_type TEXT NOT NULL,
phone_number VARCHAR(20) NULL,
profile_image TEXT NULL,
bio TEXT NULL,
is_verified BOOLEAN DEFAULT FALSE,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();


CREATE TABLE categories (
id SERIAL PRIMARY KEY,
name VARCHAR(100) UNIQUE NOT NULL,
description TEXT NULL,
created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE services (

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






);