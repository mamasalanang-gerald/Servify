require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/DB');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@servify.com';
        const adminPassword = 'Admin@123456';
        const adminName = 'Admin User';
        const adminPhone = '+1234567890';

        // Check if admin already exists
        const existingAdmin = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
        
        if (existingAdmin.rows.length > 0) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        const result = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, user_type, phone_number, is_verified, is_active)
             VALUES ($1, $2, $3, $4, $5, TRUE, TRUE)
             RETURNING id, full_name, email, user_type`,
            [adminName, adminEmail, hashedPassword, 'admin', adminPhone]
        );

        console.log('✓ Admin user created successfully');
        console.log('Admin Details:');
        console.log(`  Email: ${adminEmail}`);
        console.log(`  Password: ${adminPassword}`);
        console.log(`  ID: ${result.rows[0].id}`);
        console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
