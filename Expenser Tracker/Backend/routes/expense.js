const express = require('express');

const authMiddleware = require('../middlewares/auth');

const expenseController = require('../controllers/expense');

const router = express.Router();

// /admin/add-product => GET

router.get('/getExpenses', authMiddleware,expenseController.getExpenses);

 router.post('/addExpense', authMiddleware, expenseController.addExpense);

router.put('/updateExpense/:expenseId', expenseController.updateExpense);

router.delete('/deleteExpense/:expenseId', authMiddleware, expenseController.deleteExpense);

module.exports = router;