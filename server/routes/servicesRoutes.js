const express = require('express');
const router = express.Router();
const { getServices, getServicesbyId, createServices, editServices, removeService } = require('../controllers/servicesController');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/',verifyToken, getServices);
router.get('/:id',verifyToken, getServicesbyId);

router.post('/create',verifyToken ,authorizeRoles('provider'), createServices);
router.put('/edit/:id',verifyToken ,authorizeRoles('provider'), editServices);
router.delete('/:id',verifyToken ,authorizeRoles('provider'), removeService);

module.exports = router;