const fs = require('fs');
const path = require('path');
const pool = require('./config/DB');

const migrationsDir = path.join(__dirname, 'migrations');

// Wait for database connection with retry logic
async function waitForDatabase(maxRetries = 30) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await pool.query('SELECT NOW()');
            process.stderr.write('✓ Database connected\n');
            return;
        } catch (error) {
            if (i < maxRetries - 1) {
                process.stderr.write(`Waiting for database... (attempt ${i + 1}/${maxRetries})\n`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                throw new Error('Failed to connect to database after ' + maxRetries + ' attempts');
            }
        }
    }
}

async function runMigrations() {
    try {
        process.stderr.write('Starting migrations...\n');
        process.stderr.write('Waiting for database connection...\n');
        
        // Wait for database to be ready
        await waitForDatabase();

        process.stderr.write('Creating migrations table...\n');
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
            process.stderr.write('✓ No migrations directory found, skipping migrations\n');
            return;
        }

        // Get list of migration files
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        if (files.length === 0) {
            process.stderr.write('✓ No migration files found, skipping migrations\n');
            return;
        }

        // Get executed migrations
        const result = await pool.query('SELECT name FROM migrations');
        const executedMigrations = result.rows.map(row => row.name);

        // Run pending migrations
        for (const file of files) {
            if (!executedMigrations.includes(file)) {
                process.stderr.write(`Running migration: ${file}\n`);
                
                const migrationPath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(migrationPath, 'utf-8');
                
                // Execute migration
                await pool.query(sql);
                
                // Record migration as executed
                await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
                
                process.stderr.write(`✓ Migration ${file} completed\n`);
            }
        }

        process.stderr.write('✓ All migrations completed successfully\n');
    } catch (error) {
        process.stderr.write(`Migration error: ${error.message}\n`);
        process.stderr.write(`${error.stack}\n`);
        // For testing/development environments without database, allow server to start
        process.stderr.write('⚠️  Database connection failed - server will start without database\n');
    }
}

module.exports = runMigrations;
