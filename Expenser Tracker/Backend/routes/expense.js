const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

// /admin/add-product => GET

router.get('/getExpenses', expenseController.getExpenses);

 router.post('/addExpense', expenseController.addExpense);

router.put('/updateExpense/:expenseId', expenseController.updateExpense);

router.delete('/deleteExpense/:expenseId', expenseController.deleteExpense);

module.exports = router;