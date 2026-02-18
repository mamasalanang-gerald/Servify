const express = require('express');
const router = express.Router();

const { 

    getUsers, getUsersById,
    createUser, updateUser, deleteUser

} = require('../controllers/AuthController');

router.get('/', getUsers);
router.get('/:id', getUsersById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;