const Expense = require('../models/expense');

const sequelize = require('../util/database');

const Items_Per_Page = 2;

exports.getExpenses = async (req,res,next)=>{
    try{
        const page = +req.query.page || 1;
        const totalExpenses = await Expense.count({where:{userId:req.user.id}});
        console.log(totalExpenses)
        const expenses = await req.user.getExpenses({
            offset: (page-1)*Items_Per_Page,
            limit: Items_Per_Page
        })
        res.status(200).json({
            expenses:expenses,
            currentPage:page,
            nextPage: page+1,
            previousPage:page-1,
            lastPage: Math.ceil(totalExpenses/Items_Per_Page),
            hasNextPage : Items_Per_Page*page <totalExpenses,
            hasPreviousPage : page > 1
        });
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

