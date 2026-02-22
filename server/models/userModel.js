const pool = require('../config/DB');
const bcrypt = require('bcrypt');

const createUser = async (full_name, email, password, phone_number) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
    INSERT INTO users (full_name, email, password_hash, phone_number)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, email, phone_number, created_at
    `;
    const values = [full_name, email, hashedPassword, phone_number];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

const getAllUsers = async () => {
    const query = 'SELECT id, full_name, email, phone_number, user_type, created_at FROM users';
    const { rows } = await pool.query(query);
    return rows;
}

const getUserById = async (id) => {
    const query = 'SELECT id, full_name, email, phone_number, user_type, created_at FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];

}

const updateUserType = async (id, user_type) => {
    const query = `UPDATE users set user_type = $1, updated_at = NOW() 
     WHERE id = $2 RETURNING id, full_name, email, user_type, updated_at`;
     const { rows } = await pool.query(query, [user_type, id]);
     return rows[0];
}

const updateUserProfile = async (id, { full_name, email, phone_number }) => {
    const query = `
        UPDATE users 
        SET full_name = $1, email = $2, phone_number = $3, updated_at = NOW() 
        WHERE id = $4 
        RETURNING id, full_name, email, phone_number, user_type, created_at
    `;
    const { rows } = await pool.query(query, [full_name, email, phone_number, id]);
    return rows[0];
}

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    deleteUser,
    findUserByEmail,
    updateUserType,
    updateUserProfile
}
