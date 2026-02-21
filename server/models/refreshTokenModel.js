const pool = require('../config/DB');
const bcrypt = require('bcrypt');

const storeRefreshToken = async (userId, refreshToken) => {
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const query = `
        INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
    `;
    await pool.query(query, [userId, tokenHash, expiresAt]);
};

const findRefreshToken = async (userId) => {
    const query = `
        SELECT * FROM refresh_tokens
        WHERE user_id = $1 AND expires_at > NOW()
        ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows; 
};

const deleteRefreshToken = async (userId, tokenHash) => {
    const query = `DELETE FROM refresh_tokens WHERE user_id = $1 AND token_hash = $2`;
    await pool.query(query, [userId, tokenHash]);
};

const deleteAllUserRefreshTokens = async (userId) => {
    const query = `DELETE FROM refresh_tokens WHERE user_id = $1`;
    await pool.query(query, [userId]);
};

module.exports = { storeRefreshToken, findRefreshToken, deleteRefreshToken, deleteAllUserRefreshTokens };
