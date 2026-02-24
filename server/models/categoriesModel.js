const pool = require('../config/DB');

const createCategory = async(name, description) => {
    const result = await pool.query(
        `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
        [name, description]
    );
    return result.rows[0];
}

const getAllCategories = async() => {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
}

const getAllCategoriesWithCount = async () => {
  const result = await pool.query(`
        SELECT c.*, COUNT(s.id)::int AS service_count
        FROM categories c
        LEFT JOIN services s ON s.category_id = c.id AND s.is_active = true
        GROUP BY c.id
        ORDER BY c.name
    `);
  return result.rows;
};

const getCategoryById = async(id) => {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
}

const updateCategory = async(id, name, description) => {
    const result = await pool.query(
        `UPDATE categories SET name = $1, description = $2, updated_at = NOW()
         WHERE id = $3 RETURNING *`,
        [name, description, id]
    );
    return result.rows[0];
}

const deleteCategory = async(id) => {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}

module.exports = {
    createCategory,
    getAllCategories,
    getAllCategoriesWithCount,
    getCategoryById,
    updateCategory,
    deleteCategory
}