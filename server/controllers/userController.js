const getProfile = async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
};

