const { getUserById, getAllUsers } = require('../models/userModel');

const getProfile = async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
};

const listUsers = async (req, res) => {
    const users = await getAllUsers();
    if(!users) return res.status(404).json({ message: 'Users not found' });
    res.status(200).json(users);
}

module.exports = { getProfile, listUsers };