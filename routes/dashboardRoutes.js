const router = require('express').Router();
const {
    getDashboardData
} = require('../controllers/dashboardController');
const { validateUser } = require('../middlewares/accessMiddleware');

router.get('/', validateUser, getDashboardData);

module.exports = router;