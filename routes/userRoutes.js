const router = require('express').Router();
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { validateUser } = require('../middlewares/accessMiddleware');

router.get('/', validateUser, getAllUsers);
router.post('/', validateUser,  createUser);
router.put('/:id', validateUser, updateUser);
router.delete('/:id', validateUser, deleteUser);

module.exports = router;