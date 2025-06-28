const router = require('express').Router();
const {
    login,
    forgotPassword,
    resetPassword,
    authPacket
} = require('../controllers/authController');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/auth-packet', authPacket);

module.exports = router;