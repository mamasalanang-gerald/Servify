const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/AuthController');

console.log('AuthRoutes loaded');


router.get('/test', function(req, res) {
    console.log('=== TEST ROUTE WAS HIT ===');
    res.json({ message: 'Test route works!' });
});


router.post('/register', function(req, res) {
    console.log('=== REGISTER ROUTE WAS HIT ===');
    console.log('Body:', req.body);
    res.json({ message: 'Register endpoint works!' });
});

module.exports = router;