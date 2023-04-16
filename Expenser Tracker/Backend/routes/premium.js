const express = require('express');

const authMiddleware = require('../middlewares/auth');

const premiumController = require('../controllers/premium');

const router = express.Router();

// /admin/add-product => GET

router.get('/showLeaderboard',authMiddleware,premiumController.getLeaderboard);

module.exports = router;