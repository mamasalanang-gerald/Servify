require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const runMigrations = require('./migrate');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();


process.stderr.write('Script starting...\n');

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/services", servicesRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/admin', adminRoutes);


app.get('/', (req, res) => {
    res.send('Servify API is running!');
});

// Run migrations before starting the server
async function startServer() {
    try {
        // Skip migrations in test environment
        if (process.env.NODE_ENV !== 'test') {
            process.stderr.write('Running database migrations...\n');
            await runMigrations();
        } else {
            process.stderr.write('Skipping migrations in test environment\n');
        }

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        process.stderr.write(`Failed to start server: ${error.message}\n`);
        process.exit(1);
    }
}

startServer();

