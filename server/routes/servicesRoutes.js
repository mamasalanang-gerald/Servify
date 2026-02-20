const express = require('express');
const router = express.Router();
const { getAllServices, getServicesbyId, createServices, editServices, removeService } = require('../controllers/servicesController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', getAllServices);
router.get('/:id', getServicesbyId);

router.post('/create', verifyToken, createServices);
router.put('/edit/:id', verifyToken, editServices);
router.delete('/delete/:id', verifyToken, removeService);

module.exports = router;