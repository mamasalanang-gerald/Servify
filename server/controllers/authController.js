const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail, getUserById } = require('../models/userModel');
const { storeRefreshToken, findRefreshToken, deleteRefreshToken, deleteAllUserRefreshTokens } = require('../models/helper/refreshTokenModel');

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

    const payload = { id: user.id, email: user.email, role: user.user_type };

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

    await storeRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(200).json({ 
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        full_name: user.full_name
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    
    try{

    const storedTokens = await findRefreshToken(decoded.id);
    let matchedToken = null;
    
    for (const stored of storedTokens) {
        const isMatch = await bcrypt.compare(refreshToken, stored.token_hash);
        if (isMatch) {
            matchedToken = stored;
            break;
        }
    }

    if (!matchedToken) {
        await deleteAllUserRefreshTokens(decoded.id);
        return res.status(403).json({ message: 'Refresh token revoked' });
    }

    await deleteRefreshToken(decoded.id, matchedToken.token_hash);

    const user = await getUserById(decoded.id);
    if (!user) {
        await deleteAllUserRefreshTokens(decoded.id);
        return res.status(403).json({ message: 'User not found' });
    }

   
    const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
        { id: user.id, email: user.email, role: user.user_type },
        process.env.JWT_SECRET_REFRESH,
        { expiresIn: '7d' }
    );

    await storeRefreshToken(decoded.id, newRefreshToken);

   
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken: newAccessToken });

    } catch(err){
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, {
                ignoreExpiration: true
            });
            await deleteAllUserRefreshTokens(decoded.id);
        } catch (err) {
          return res.status(403).json({ message: 'Invalid or expired refresh token' });

        }
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

    res.status(200).json({ message: 'Log out successfully!' });
};


module.exports = { register, login, refresh, logout }; 

