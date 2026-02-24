const { createCategory: insertCategory, getAllCategories: retrieveAllCategories, getCategoryById: retrieveCategoryById, updateCategory: modifyCategory, deleteCategory: removeCategory, getAllCategoriesWithCount } = require('../models/categoriesModel');

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await insertCategory(name, description);
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (err) {
        res.status(500).json({ message: 'Error creating category', error: err.message });
    }
};

const getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await getAllCategoriesWithCount();
    res.status(200).json({ categories });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: err.message });
  }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await retrieveAllCategories();
        res.status(200).json({ message: 'Categories fetched successfully', categories });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await retrieveCategoryById(id);
        res.status(200).json({ message: 'Category fetched successfully', category });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching category', error: err.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await modifyCategory(id, name, description);
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (err) {
        res.status(500).json({ message: 'Error updating category', error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await removeCategory(id);
        res.status(200).json({ message: 'Category deleted successfully', category });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting category', error: err.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoriesWithCount,
    updateCategory,
    deleteCategory
}