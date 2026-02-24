require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/DB');

const seedTestData = async () => {
    try {
        console.log('Starting database seeding...\n');

        // 1. Create Categories
        console.log('Creating categories...');
        const categories = [
            { name: 'Home Cleaning', description: 'Professional home cleaning services' },
            { name: 'Plumbing', description: 'Plumbing repair and installation' },
            { name: 'Electrical', description: 'Electrical services and repairs' },
            { name: 'Gardening', description: 'Garden maintenance and landscaping' },
            { name: 'Painting', description: 'Interior and exterior painting' },
            { name: 'Carpentry', description: 'Furniture and woodwork services' }
        ];

        const categoryIds = [];
        for (const cat of categories) {
            const result = await pool.query(
                'INSERT INTO categories (name, description) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET description = $2 RETURNING id',
                [cat.name, cat.description]
            );
            categoryIds.push(result.rows[0].id);
        }
        console.log(`✓ Created ${categoryIds.length} categories\n`);

        // 2. Create Users (Clients)
        console.log('Creating client users...');
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        
        const clients = [
            { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
            { name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891' },
            { name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892' },
            { name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1234567893' },
            { name: 'Tom Brown', email: 'tom@example.com', phone: '+1234567894' }
        ];

        const clientIds = [];
        for (const client of clients) {
            const result = await pool.query(
                `INSERT INTO users (full_name, email, password_hash, user_type, phone_number, is_verified, is_active)
                 VALUES ($1, $2, $3, 'client', $4, TRUE, TRUE)
                 ON CONFLICT (email) DO UPDATE SET full_name = $1
                 RETURNING id`,
                [client.name, client.email, hashedPassword, client.phone]
            );
            clientIds.push(result.rows[0].id);
        }
        console.log(`✓ Created ${clientIds.length} client users\n`);

        // 3. Create Providers
        console.log('Creating provider users...');
        const providers = [
            { name: 'Alice Provider', email: 'alice@provider.com', phone: '+1234567895', verified: true },
            { name: 'Bob Provider', email: 'bob@provider.com', phone: '+1234567896', verified: true },
            { name: 'Carol Provider', email: 'carol@provider.com', phone: '+1234567897', verified: false },
            { name: 'David Provider', email: 'david@provider.com', phone: '+1234567898', verified: true },
            { name: 'Eve Provider', email: 'eve@provider.com', phone: '+1234567899', verified: false }
        ];

        const providerIds = [];
        for (const provider of providers) {
            const result = await pool.query(
                `INSERT INTO users (full_name, email, password_hash, user_type, phone_number, is_verified, is_active, bio)
                 VALUES ($1, $2, $3, 'provider', $4, $5, TRUE, 'Experienced service provider')
                 ON CONFLICT (email) DO UPDATE SET full_name = $1, is_verified = $5
                 RETURNING id`,
                [provider.name, provider.email, hashedPassword, provider.phone, provider.verified]
            );
            providerIds.push(result.rows[0].id);
        }
        console.log(`✓ Created ${providerIds.length} provider users\n`);

        // 4. Create Services
        console.log('Creating services...');
        const services = [
            { title: 'Deep House Cleaning', description: 'Complete house cleaning service', price: 150.00, type: 'onsite', location: 'New York, NY', providerId: providerIds[0], categoryId: categoryIds[0], active: true },
            { title: 'Kitchen Plumbing Repair', description: 'Fix leaks and install fixtures', price: 120.00, type: 'onsite', location: 'Los Angeles, CA', providerId: providerIds[1], categoryId: categoryIds[1], active: true },
            { title: 'Electrical Wiring', description: 'Home electrical installation', price: 200.00, type: 'onsite', location: 'Chicago, IL', providerId: providerIds[0], categoryId: categoryIds[2], active: true },
            { title: 'Garden Maintenance', description: 'Weekly garden care', price: 80.00, type: 'onsite', location: 'Houston, TX', providerId: providerIds[2], categoryId: categoryIds[3], active: false },
            { title: 'Interior Painting', description: 'Professional painting service', price: 300.00, type: 'onsite', location: 'Phoenix, AZ', providerId: providerIds[3], categoryId: categoryIds[4], active: true },
            { title: 'Furniture Assembly', description: 'Assemble and install furniture', price: 90.00, type: 'onsite', location: 'Philadelphia, PA', providerId: providerIds[1], categoryId: categoryIds[5], active: true },
            { title: 'Bathroom Cleaning', description: 'Deep bathroom cleaning', price: 60.00, type: 'onsite', location: 'San Antonio, TX', providerId: providerIds[3], categoryId: categoryIds[0], active: true },
            { title: 'Emergency Plumbing', description: '24/7 plumbing service', price: 180.00, type: 'onsite', location: 'San Diego, CA', providerId: providerIds[0], categoryId: categoryIds[1], active: true }
        ];

        const serviceIds = [];
        for (const service of services) {
            const result = await pool.query(
                `INSERT INTO services (provider_id, category_id, title, description, price, service_type, location, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING id`,
                [service.providerId, service.categoryId, service.title, service.description, service.price, service.type, service.location, service.active]
            );
            serviceIds.push(result.rows[0].id);
        }
        console.log(`✓ Created ${serviceIds.length} services\n`);

        // 5. Create Bookings
        console.log('Creating bookings...');
        const bookings = [
            { serviceId: serviceIds[0], clientId: clientIds[0], providerId: providerIds[0], date: '2026-03-01', time: '10:00:00', location: 'New York, NY', status: 'pending', price: 150.00, notes: 'Please bring cleaning supplies' },
            { serviceId: serviceIds[1], clientId: clientIds[1], providerId: providerIds[1], date: '2026-03-02', time: '14:00:00', location: 'Los Angeles, CA', status: 'accepted', price: 120.00, notes: 'Kitchen sink is leaking' },
            { serviceId: serviceIds[2], clientId: clientIds[2], providerId: providerIds[0], date: '2026-02-28', time: '09:00:00', location: 'Chicago, IL', status: 'completed', price: 200.00, notes: 'Install new outlets' },
            { serviceId: serviceIds[4], clientId: clientIds[3], providerId: providerIds[3], date: '2026-02-25', time: '08:00:00', location: 'Phoenix, AZ', status: 'completed', price: 300.00, notes: 'Paint living room' },
            { serviceId: serviceIds[5], clientId: clientIds[4], providerId: providerIds[1], date: '2026-03-05', time: '15:00:00', location: 'Philadelphia, PA', status: 'pending', price: 90.00, notes: 'Assemble IKEA furniture' },
            { serviceId: serviceIds[6], clientId: clientIds[0], providerId: providerIds[3], date: '2026-02-20', time: '11:00:00', location: 'San Antonio, TX', status: 'completed', price: 60.00, notes: 'Deep clean bathroom' },
            { serviceId: serviceIds[7], clientId: clientIds[2], providerId: providerIds[0], date: '2026-02-15', time: '16:00:00', location: 'San Diego, CA', status: 'cancelled', price: 180.00, notes: 'Emergency leak repair' }
        ];

        const bookingIds = [];
        for (const booking of bookings) {
            const result = await pool.query(
                `INSERT INTO bookings (service_id, client_id, provider_id, booking_date, booking_time, user_location, status, total_price, notes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING id`,
                [booking.serviceId, booking.clientId, booking.providerId, booking.date, booking.time, booking.location, booking.status, booking.price, booking.notes]
            );
            bookingIds.push(result.rows[0].id);
        }
        console.log(`✓ Created ${bookingIds.length} bookings\n`);

        // 6. Create Reviews (only for completed bookings)
        console.log('Creating reviews...');
        const completedBookingIndices = [2, 3, 5]; // Indices of completed bookings
        const reviews = [
            { bookingIdx: 2, rating: 5, comment: 'Excellent service! Very professional and thorough.' },
            { bookingIdx: 3, rating: 4, comment: 'Good work, but took longer than expected.' },
            { bookingIdx: 5, rating: 5, comment: 'Amazing! My bathroom looks brand new.' }
        ];

        for (const review of reviews) {
            const booking = bookings[review.bookingIdx];
            await pool.query(
                `INSERT INTO reviews (booking_id, client_id, provider_id, rating, comment)
                 VALUES ($1, $2, $3, $4, $5)`,
                [bookingIds[review.bookingIdx], booking.clientId, booking.providerId, review.rating, review.comment]
            );
        }
        console.log(`✓ Created ${reviews.length} reviews\n`);

        console.log('✅ Database seeding completed successfully!\n');
        console.log('Summary:');
        console.log(`  - ${categoryIds.length} categories`);
        console.log(`  - ${clientIds.length} clients`);
        console.log(`  - ${providerIds.length} providers`);
        console.log(`  - ${serviceIds.length} services`);
        console.log(`  - ${bookingIds.length} bookings`);
        console.log(`  - ${reviews.length} reviews`);
        console.log('\nTest credentials:');
        console.log('  Admin: admin@servify.com / Admin@123456');
        console.log('  Client: john@example.com / Password123!');
        console.log('  Provider: alice@provider.com / Password123!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        console.error(error);
        process.exit(1);
    }
};

seedTestData();
