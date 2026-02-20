const pool = require('../config/DB');

const getServices = async () => {
    const result = await pool.query('SELECT * FROM services');
    return result.rows;
}

const getServicesbyId = async(id) => {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    return result.rows[0];
}

const createServices = async(name, description, price, category) => {
    const result = await pool.query('INSERT INTO services (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, price, category]);
    return result.rows[0];
}

const editServices = async(id, name, description, price, category) => {
    const result = await pool.query('UPDATE services SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *', [name, description, price, category, id]);
    return result.rows[0];
}

const removeService = async(id) => {
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}

module.exports = {
    getServices,
    getServicesbyId,
    createServices,
    editServices,
    removeService
}