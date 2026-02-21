const express = require('express');
const router = express.Router();
const { register, login, refresh } = require('../controllers/authController');


console.log('AuthRoutes loaded');
console.log('register:', register);
console.log('login:', login);


router.post('/register', register);
router.post('/login', login);

router.post('/refresh', refresh);

module.exports = router;
