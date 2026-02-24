const pool = require('../config/DB');

const getServices = async (filters = {}) => {
  let query = `
        SELECT s.*,
               c.name AS category_name,
               u.full_name AS provider_name,
               COALESCE(AVG(r.rating), 0) AS average_rating,
               COUNT(DISTINCT r.id) AS review_count,
               (SELECT COUNT(*) FROM bookings b 
                WHERE b.provider_id = s.provider_id 
                  AND b.status = 'completed') AS jobs_completed
        FROM services s
        JOIN categories c ON s.category_id = c.id
        JOIN users u ON s.provider_id = u.id
        LEFT JOIN bookings bk ON bk.service_id = s.id
        LEFT JOIN reviews r ON r.booking_id = bk.id
        WHERE s.is_active = true
    `;
  const values = [];
  let p = 0;

  if (filters.category_id) {
    p++;
    query += ` AND s.category_id = $${p}`;
    values.push(filters.category_id);
  }
  if (filters.max_price) {
    p++;
    query += ` AND s.price <= $${p}`;
    values.push(filters.max_price);
  }
  if (filters.search) {
    p++;
    query += ` AND (s.title ILIKE $${p} OR s.description ILIKE $${p})`;
    values.push(`%${filters.search}%`);
  }
  if (filters.category_name) {
    p++;
    query += ` AND c.name = $${p}`;
    values.push(filters.category_name);
  }

  query += ` GROUP BY s.id, c.name, u.full_name ORDER BY s.created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

const getServicesbyId = async (id) => {
  const result = await pool.query(
    `
        SELECT s.*,
               c.name AS category_name,
               u.full_name AS provider_name,
               u.bio AS provider_bio,
               COALESCE(AVG(r.rating), 0) AS average_rating,
               COUNT(DISTINCT r.id) AS review_count,
               (SELECT COUNT(*) FROM bookings b 
                WHERE b.provider_id = s.provider_id 
                  AND b.status = 'completed') AS jobs_completed
        FROM services s
        JOIN categories c ON s.category_id = c.id
        JOIN users u ON s.provider_id = u.id
        LEFT JOIN bookings bk ON bk.service_id = s.id
        LEFT JOIN reviews r ON r.booking_id = bk.id
        WHERE s.id = $1
        GROUP BY s.id, c.name, u.full_name, u.bio
    `,
    [id],
  );
  return result.rows[0];
};

const getServicesByProvider = async (provider_id) => {
  const result = await pool.query(
    `
        SELECT s.*, c.name AS category_name,
               COALESCE(AVG(r.rating), 0) AS average_rating,
               COUNT(DISTINCT bk.id) AS total_bookings
        FROM services s
        JOIN categories c ON s.category_id = c.id
        LEFT JOIN bookings bk ON bk.service_id = s.id
        LEFT JOIN reviews r ON r.booking_id = bk.id
        WHERE s.provider_id = $1
        GROUP BY s.id, c.name
        ORDER BY s.created_at DESC
    `,
    [provider_id],
  );
  return result.rows;
};

const createServices = async (
  provider_id,
  category_id,
  title,
  description,
  price,
  service_type,
  location,
  packages = [],
  image_url = null,
) => {
  const result = await pool.query(
    `INSERT INTO services (provider_id, category_id, title, description, price, service_type, location, packages, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      provider_id,
      category_id,
      title,
      description,
      price,
      service_type,
      location,
      JSON.stringify(packages),
      image_url,
    ],
  );
  return result.rows[0];
};

const editServices = async (
  id,
  title,
  description,
  price,
  service_type,
  location,
  packages,
  image_url = null,
) => {
  const result = await pool.query(
    `UPDATE services SET title = $1, description = $2, price = $3, service_type = $4, 
         location = $5, packages = $6, image_url = $7, updated_at = NOW()
         WHERE id = $8 RETURNING *`,
    [
      title,
      description,
      price,
      service_type,
      location,
      JSON.stringify(packages || []),
      image_url,
      id,
    ],
  );
  return result.rows[0];
};

const removeService = async (id) => {
  const result = await pool.query(
    "DELETE FROM services WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

const updateServiceStatus = async (id, is_active) => {
  const result = await pool.query(
    "UPDATE services SET is_active = $2, updated_at = NOW() WHERE id = $1 RETURNING *",
    [id, is_active],
  );
  return result.rows[0];
};

module.exports = {
  getServices,
  getServicesbyId,
  getServicesByProvider,
  createServices,
  editServices,
  removeService,
  updateServiceStatus,
};