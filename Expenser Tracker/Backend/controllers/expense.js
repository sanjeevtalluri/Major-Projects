const Expense = require('../models/expense');

const sequelize = require('../util/database');

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
  const t = await sequelize.transaction();
  try{
    const updatedBody = {...req.body,userId:req.user.id}
    const expense = await Expense.create(updatedBody,{transaction:t});
    req.user.totalExpensesAmount = req.user.totalExpensesAmount + parseInt(req.body.amount);
    await req.user.save({transaction:t});
    await t.commit();
    res.status(200).json(expense);
  }
  catch(err){
    await t.rollback();
    res.status(401).json({success:'false'});
  }
}

exports.updateExpense = async (req,res,next)=>{
  const t = await sequelize.transaction();
  try{
    const expense = await Expense.findByPk(req.params.expenseId);
    if (expense) {
      expense.amount = req.body.amount;
      expense.description = req.body.description;
      expense.category = req.body.category;
      await expense.save({transaction:t});
      await t.commit();
      res.status(200).json();
     } else {
      res.status(404).json({success:false,message:'Expense not found'});
     }
  }
  catch(err){
    await t.rollback();
    res.status(401).json({success:'false'});
  }
}

exports.deleteExpense = async (req,res,next)=>{
  const t = await sequelize.transaction();
  try{
    const expense = await Expense.findOne({where:{id:req.params.expenseId,userId:req.user.id}});
    if (expense) {
      const expenseAmount = expense.amount;
      await expense.destroy({transaction:t});
      req.user.totalExpensesAmount = req.user.totalExpensesAmount - parseInt(expenseAmount);
      await req.user.save({transaction:t});
      await t.commit();
      res.status(200).json();
     } else {
        res.status(404).json({success:false,message:'Expense not found'});
     }
  }
  catch(err){
    await t.rollback();
    res.status(401).json({success:'false'});
  }
}

