const express = require('express');

const authMiddleware = require('../middlewares/auth');

const purchaseController = require('../controllers/purchase');

const router = express.Router();

// /admin/add-product => GET

router.get('/buyPremium', authMiddleware,purchaseController.buyPremium);

router.post('/updateTransactionStatus', authMiddleware,purchaseController.updateTransactionStatus);

router.post('/updateTransactionStatusFail', authMiddleware,purchaseController.updateTransactionStatusFail);



module.exports = router;