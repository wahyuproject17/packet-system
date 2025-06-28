const router = require('express').Router();
const {
    getAllHistories,
    createHistory,
    updateHistory,
    deleteHistory
} = require('../controllers/historyController');
const { validateUser } = require('../middlewares/accessMiddleware');
const { upload, compressImage } = require('../utils/multerConfig');

router.get('/', validateUser, getAllHistories);
router.post('/', upload.single('courier_photo'), compressImage, createHistory);
router.put('/:id', upload.single('image'), compressImage, updateHistory);
router.delete('/:id', validateUser, deleteHistory);

module.exports = router;