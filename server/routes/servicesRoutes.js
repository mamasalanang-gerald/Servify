const express = require('express');
const router = express.Router();
const { getServices, getServicesbyId } = require('../controllers/servicesController');

router.get('/', getServices);
router.get('/:id', getServicesbyId);

router.post('/create', createServices);
router.put('/edit/:id', editServices);

module.exports = router;