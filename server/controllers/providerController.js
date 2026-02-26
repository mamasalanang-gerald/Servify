const bookingModel = require('../models/bookingModel');
const db = require('../config/DB');

// Get earnings summary for a provider
const getEarningsSummary = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Get all completed bookings for the provider
    const completedBookings = await db.query(
      `SELECT SUM(total_price) as total_earned, COUNT(*) as total_bookings
       FROM bookings
       WHERE provider_id = $1 AND status = 'completed'`,
      [providerId]
    );

    // Get this month's earnings
    const thisMonthBookings = await db.query(
      `SELECT SUM(total_price) as month_earned, COUNT(*) as month_bookings
       FROM bookings
       WHERE provider_id = $1 
       AND status = 'completed'
       AND EXTRACT(MONTH FROM booking_date) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM booking_date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
      [providerId]
    );

    // Calculate pending payout (completed but not yet paid out)
    const pendingPayout = thisMonthBookings.rows[0]?.month_earned || 0;

    // Get provider rating summary from raw reviews
    const reviewSummary = await db.query(
      `SELECT COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as review_count
       FROM reviews
       WHERE provider_id = $1`,
      [providerId]
    );

    const totalEarned = parseFloat(completedBookings.rows[0]?.total_earned || 0);
    const monthEarned = parseFloat(thisMonthBookings.rows[0]?.month_earned || 0);
    const avgRating = parseFloat(reviewSummary.rows[0]?.avg_rating || 0);
    const reviewCount = parseInt(reviewSummary.rows[0]?.review_count || 0);

    res.status(200).json({
      totalEarned,
      totalBookings: parseInt(completedBookings.rows[0]?.total_bookings || 0),
      monthEarned,
      monthBookings: parseInt(thisMonthBookings.rows[0]?.month_bookings || 0),
      pendingPayout: parseFloat(pendingPayout),
      avgRating,
      reviewCount,
    });
  } catch (err) {
    console.error('Error fetching earnings summary:', err);
    res.status(500).json({ message: 'Error fetching earnings summary', error: err.message });
  }
};

// Get transaction history for a provider
const getTransactions = async (req, res) => {
  try {
    const { providerId } = req.params;

    const transactions = await db.query(
      `SELECT 
        b.id,
        b.booking_date as date,
        b.total_price as gross,
        u.full_name as client,
        s.title as service,
        b.status
       FROM bookings b
       JOIN users u ON b.client_id = u.id
       JOIN services s ON b.service_id = s.id
       WHERE b.provider_id = $1 AND b.status = 'completed'
       ORDER BY b.booking_date DESC
       LIMIT 50`,
      [providerId]
    );

    const formattedTransactions = transactions.rows.map(t => {
      const gross = parseFloat(t.gross);
      const fee = Math.round(gross * 0.10); // 10% platform fee
      const net = gross - fee;

      return {
        id: t.id,
        date: new Date(t.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        client: t.client,
        service: t.service,
        gross,
        fee,
        net,
      };
    });

    res.status(200).json(formattedTransactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Error fetching transactions', error: err.message });
  }
};

// Get payout history for a provider (mock data for now)
const getPayouts = async (req, res) => {
  try {
    const { providerId } = req.params;

    // For now, return mock payouts
    // In a real system, you'd have a payouts table
    const payouts = [
      {
        id: 1,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        method: 'GCash',
        amount: 0,
        status: 'completed'
      }
    ];

    res.status(200).json(payouts);
  } catch (err) {
    console.error('Error fetching payouts:', err);
    res.status(500).json({ message: 'Error fetching payouts', error: err.message });
  }
};

// Get monthly earnings data for charts
const getMonthlyEarnings = async (req, res) => {
  try {
    const { providerId } = req.params;
    const months = parseInt(req.query.months) || 6;
    if (!Number.isFinite(months) || months < 1 || months > 24) {
      return res.status(400).json({ message: 'months must be an integer between 1 and 24' });
    }

    const monthlyData = await db.query(
      `SELECT 
        TO_CHAR(booking_date, 'Mon') as month,
        EXTRACT(MONTH FROM booking_date) as month_num,
        SUM(total_price) as net
       FROM bookings
       WHERE provider_id = $1 
       AND status = 'completed'
       AND booking_date >= CURRENT_DATE - make_interval(months => $2)
       GROUP BY TO_CHAR(booking_date, 'Mon'), EXTRACT(MONTH FROM booking_date), EXTRACT(YEAR FROM booking_date)
       ORDER BY EXTRACT(YEAR FROM booking_date), EXTRACT(MONTH FROM booking_date)`,
      [providerId, months]
    );

    const formattedData = monthlyData.rows.map(d => ({
      month: d.month,
      net: Math.round(parseFloat(d.net) * 0.9) // After 10% platform fee
    }));

    res.status(200).json(formattedData);
  } catch (err) {
    console.error('Error fetching monthly earnings:', err);
    res.status(500).json({ message: 'Error fetching monthly earnings', error: err.message });
  }
};

module.exports = {
  getEarningsSummary,
  getTransactions,
  getPayouts,
  getMonthlyEarnings,
};
