const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');

const register = async (req, res) => {
  const { full_name, email, password, phone_number } = req.body;
  try {
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) return res.status(400).json({ message: 'Email already in use' });

    const user = await createUser(full_name, email, password, phone_number);
    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, email: user.email };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const logout = async (req, res) => {
    localStorage.removeItem('refreshToken');
    res.status(200).json({ message: 'Logged out' });
}

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: '7d' }
        );
        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    });
};



module.exports = { register, login, logout, refresh };

