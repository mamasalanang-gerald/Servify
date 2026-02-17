require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});