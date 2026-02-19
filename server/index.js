require('dotenv').config();
const express = require('express');
const cors = require('cors');
const runMigrations = require('./migrate');
const authRoutes = require('./routes/AuthRoutes');
const app = express();

app.use(cors());
app.use(express.json());

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
    optionsSuccessStatus: 200
};
app.post('/direct-test', (req, res) => {
    console.log('=== DIRECT TEST ROUTE HIT ===');
    res.json({ message: 'Direct route works!' });
});

app.use(cors(corstOptions));
app.use(express.json());
app.use("/api/v1/auth", authRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Run migrations before starting the server
async function startServer() {
    try {
        process.stderr.write('Running database migrations...\n');
        await runMigrations();
        
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        process.stderr.write(`Failed to start server: ${error.message}\n`);
        process.exit(1);
    }
}

startServer();