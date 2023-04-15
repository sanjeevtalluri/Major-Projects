const Expense = require('../models/expense');


exports.getExpenses = async (req,res,next)=>{

  try{
    const expenses = await Expense.findAll();
    res.json(expenses);
  }
  catch(err){
    res.json(err);
  }
}
exports.addExpense = async (req,res,next)=>{
  try{
    const expense = await Expense.create(req.body);
    if (expense) {
      res.json(expense);
     } else {
      res.status(500);
     }
  }
  catch(err){
    res.json(err);
  }
}

exports.updateExpense = async (req,res,next)=>{
  try{
    const expense = await Expense.findByPk(req.params.expenseId);
    if (expense) {
      expense.amount = req.body.amount;
      expense.description = req.body.description;
      expense.category = req.body.category;
      await expense.save();
      res.json();
     } else {
      res.status(500);
     }
  }
  catch(err){
    res.json(err);
  }
}

exports.deleteExpense = async (req,res,next)=>{
  try{
    const expense = await Expense.findByPk(req.params.expenseId);
    if (expense) {
      await expense.destroy();
      res.json();
     } else {
      res.status(500);
     }
  }
  catch(err){
    res.json(err);
  }
}

