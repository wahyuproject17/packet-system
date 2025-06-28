const router = require('express').Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const packetRoutes = require('./packetRoutes');
const historyRoutes = require('./historyRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/packet', packetRoutes);
router.use('/api/v1/history', historyRoutes);
router.use('/api/v1/dashboard', dashboardRoutes);

module.exports = router;