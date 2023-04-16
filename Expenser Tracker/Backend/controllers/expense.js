const Expense = require('../models/expense');


exports.getExpenses = async (req,res,next)=>{
    try{
        const expenses = await Expense.findAll({where:{userId:req.user.id}});
        res.status(200).json(expenses);
      }
      catch(err){
        res.status(401).json({success:'false'});
      }
  
}
exports.addExpense = async (req,res,next)=>{
  try{
    const updatedBody = {...req.body,userId:req.user.id}
    const expense = await Expense.create(updatedBody);
    req.user.totalExpensesAmount = req.user.totalExpensesAmount + parseInt(req.body.amount);
    await req.user.save();
    res.status(200).json(expense);
  }
  catch(err){
    res.status(401).json({success:'false'});
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
      res.status(200).json();
     } else {
      res.status(404).json({success:false,message:'Expense not found'});
     }
  }
  catch(err){
    res.status(401).json({success:'false'});
  }
}

exports.deleteExpense = async (req,res,next)=>{
  try{
    const expense = await Expense.findOne({where:{id:req.params.expenseId,userId:req.user.id}});
    if (expense) {
      await expense.destroy();
      res.status(200).json();
     } else {
        res.status(404).json({success:false,message:'Expense not found'});
     }
  }
  catch(err){
    res.status(401).json({success:'false'});
  }
}

