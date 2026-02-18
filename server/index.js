require('dotenv').config();
const express = require('express');
const cors = require('cors');
const runMigrations = require('./migrate');
const app = express();

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

app.use(cors(corstOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Run migrations before starting the server
async function startServer() {
    try {
        console.log('Running database migrations...');
        await runMigrations();
        
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();