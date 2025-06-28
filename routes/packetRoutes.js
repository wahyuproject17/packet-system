const router = require('express').Router();
const {
    getAllPackets,
    createPacket,
    updatePacket,
    deletePacket
}
= require('../controllers/packetController');
const { validateUser } = require('../middlewares/accessMiddleware');

router.get('/', validateUser, getAllPackets);
router.post('/', validateUser, createPacket);
router.put('/:id', validateUser, updatePacket);
router.delete('/:id', validateUser, deletePacket);

module.exports = router;