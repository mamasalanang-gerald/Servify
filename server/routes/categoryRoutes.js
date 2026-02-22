const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoriesController');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/',verifyToken, authorizeRoles('admin'), createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);    
router.put('/:id',verifyToken, authorizeRoles('admin'), updateCategory);
router.delete('/:id',verifyToken, authorizeRoles('admin'), deleteCategory);

module.exports = router;