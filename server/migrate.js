const fs = require('fs');
const path = require('path');
const pool = require('./config/DB');

const migrationsDir = path.join(__dirname, 'migrations');

async function runMigrations() {
    try {
        // Create migrations table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if migrations directory exists
        if (!fs.existsSync(migrationsDir)) {
            console.log('✓ No migrations directory found, skipping migrations');
            return;
        }

        // Get list of migration files
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        if (files.length === 0) {
            console.log('✓ No migration files found, skipping migrations');
            return;
        }

        // Get executed migrations
        const result = await pool.query('SELECT name FROM migrations');
        const executedMigrations = result.rows.map(row => row.name);

        // Run pending migrations
        for (const file of files) {
            if (!executedMigrations.includes(file)) {
                console.log(`Running migration: ${file}`);
                
                const migrationPath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(migrationPath, 'utf-8');
                
                // Execute migration
                await pool.query(sql);
                
                // Record migration as executed
                await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
                
                console.log(`✓ Migration ${file} completed`);
            }
        }

        console.log('✓ All migrations completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

module.exports = runMigrations;
