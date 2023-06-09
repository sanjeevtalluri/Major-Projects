
const express = require('express');

const authController = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');


const router = express.Router();

// /admin/add-product => GET


router.post('/signup', authController.createUser);

router.post('/login', authController.loginUser);

router.get('/isPremiumUser', authMiddleware, authController.isPremiumUser);

router.get('/downloadReport', authMiddleware, authController.downloadReport);

router.get('/fileDownloads',authMiddleware,authController.fileDownloads);

module.exports = router;
