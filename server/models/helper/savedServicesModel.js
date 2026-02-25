const pool = require("../../config/DB");

const saveService = async (user_id, service_id) => {
  const result = await pool.query(
    `INSERT INTO saved_services (user_id, service_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, service_id) DO NOTHING
         RETURNING *`,
    [user_id, service_id],
  );
  return result.rows[0];
};

const unsaveService = async (user_id, service_id) => {
  const result = await pool.query(
    "DELETE FROM saved_services WHERE user_id = $1 AND service_id = $2 RETURNING *",
    [user_id, service_id],
  );
  return result.rows[0];
};

const getSavedByUser = async (user_id) => {
  const result = await pool.query(
    `
        SELECT s.*,
               c.name AS category_name,
               u.full_name AS provider_name,
               u.profile_image AS provider_image,
               COALESCE(AVG(r.rating), 0) AS average_rating,
               COUNT(DISTINCT r.id) AS review_count,
               (
                 SELECT COUNT(*)
                 FROM bookings b
                 WHERE b.provider_id = s.provider_id
                   AND b.status = 'completed'
               ) AS jobs_completed,
               sv.created_at AS saved_at
        FROM saved_services sv
        JOIN services s ON sv.service_id = s.id
        JOIN categories c ON s.category_id = c.id
        JOIN users u ON s.provider_id = u.id
        LEFT JOIN bookings bk ON bk.service_id = s.id
        LEFT JOIN reviews r ON r.booking_id = bk.id
        WHERE sv.user_id = $1
        GROUP BY s.id, c.name, u.full_name, u.profile_image, sv.created_at
        ORDER BY sv.created_at DESC
    `,
    [user_id],
  );
  return result.rows;
};

const isSaved = async (user_id, service_id) => {
  const result = await pool.query(
    "SELECT id FROM saved_services WHERE user_id = $1 AND service_id = $2",
    [user_id, service_id],
  );
  return result.rows.length > 0;
};

module.exports = { 
    saveService, 
    unsaveService, 
    getSavedByUser, 
    isSaved 
};
