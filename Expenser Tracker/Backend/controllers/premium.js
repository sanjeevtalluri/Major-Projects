const Expense = require('../models/expense');
const User = require('../models/user');

exports.getLeaderboard = async (req,res,next)=>{
    try{
        console.log('in');
        const expenses = await Expense.findAll();
        const leaderboard = [];
        const expenseUserMap = {};
        expenses.forEach(expense=>{
            //console.log(expense);
            if(expenseUserMap[expense.userId]){
                expenseUserMap[expense.userId]+=expense.amount;
            }
            else{
                expenseUserMap[expense.userId] = expense.amount;
            }
        })
        //console.log(expenseUserMap );
        for(let key in expenseUserMap){
           const user =  await(User.findByPk(key));
           //console.log(user);
           leaderboard.push({
            name:user.name,
            totalExpensesAmount:expenseUserMap[key]
           })
        }
        leaderboard.sort((a, b) => b.totalExpensesAmount - a.totalExpensesAmount);
        console.log(leaderboard);
        res.status(200).json(leaderboard);
      }
      catch(err){
        res.status(401).json({success:'false'});
      }
  }