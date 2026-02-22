const jwt = require('jsonwebtoken');
const { getUserById, getAllUsers, updateUserType } = require('../models/userModel');
const { deleteAllUserRefreshTokens, storeRefreshToken } = require('../models/helper/refreshTokenModel');

const getProfile = async (req, res) => {
  try{

    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);

  } catch(err){
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const listUsers = async (req, res) => {
    try {
    const users = await getAllUsers();
    if(!users) return res.status(404).json({ message: 'Users not found' });
    res.status(200).json(users);

    } catch(err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
   
}

const promoteRole = async (req, res) => {
    try {
        
        if (req.user_type === 'provider') return res.status(400).json({ message: 'User is already a provider' });

        const user = await updateUserType(req.user.id, 'provider');

        if (!user) return res.status(404).json({ message: 'User not found' });

        const payload = { id: user.id, email: user.email, role: user.user_type };

        
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, { expiresIn: '7d' });

        
        await deleteAllUserRefreshTokens(user.id);
        await storeRefreshToken(user.id, newRefreshToken);

        
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'You are now a service provider',
            user,
            accessToken: newAccessToken   
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const changeUserRole = async (req, res) => {
    try {
        const { user_type } = req.body;
        const allowedRoles = ['client', 'provider', 'admin'];
        if (!allowedRoles.includes(user_type)) {
            return res.status(400).json({ message: `Invalid role. Must be one of: ${allowedRoles.join(', ')}` });
        }

        const user = await updateUserType(req.params.id, user_type);
        if (!user) return res.status(404).json({ message: 'User not found' });

         await deleteAllUserRefreshTokens(user.id);
         

        res.status(200).json({
            message: 'User role changed successfully',
            user
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getProfile, listUsers, promoteRole, changeUserRole };