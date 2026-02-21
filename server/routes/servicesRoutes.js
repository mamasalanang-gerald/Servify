const express = require('express');
const router = express.Router();
const { getServices, getServicesbyId, createServices, editServices, removeService } = require('../controllers/servicesController');

router.get('/', getServices);
router.get('/:id', getServicesbyId);

router.post('/create', createServices);
router.put('/edit/:id', editServices);
router.delete('/:id', removeService);

module.exports = router;