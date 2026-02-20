const pool = require('../config/DB');

const getServices = async () => {
    const result = await pool.query('SELECT * FROM services');
    return result.rows;
}

const getServicesbyId = async(id) => {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    return result.rows[0];
}

const createServices = async(provider_id, category_id, title, description, price, service_type, location) => {
    const result = await pool.query(
        `INSERT INTO services (provider_id, category_id, title, description, price, service_type, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [provider_id, category_id, title, description, price, service_type, location]
    );
    return result.rows[0];
}

const editServices = async(id, title, description, price, service_type, location) => {
    const result = await pool.query(
        `UPDATE services SET title = $1, description = $2, price = $3, service_type = $4, location = $5, updated_at = NOW()
         WHERE id = $6 RETURNING *`,
        [title, description, price, service_type, location, id]
    );
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