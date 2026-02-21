require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const runMigrations = require('./migrate');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const app = express();

process.stderr.write('Script starting...\n');

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

const corstOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        } else { 
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

if(bookingRoutes) console.log("valid")
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/services", servicesRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
    res.send('Servify API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
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
        
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        process.stderr.write(`Failed to start server: ${error.message}\n`);
        process.exit(1);
    }
}

startServer();
