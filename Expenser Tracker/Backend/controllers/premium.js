
const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getLeaderboard = async (req,res,next)=>{
    try{
        console.log('in');
        const leaderboardUsers = await User.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'totalExpensesAmount']],
            include:[{
                model:Expense,
                attributes:[]
            }],
            group:['user.id'],
            order:[['totalExpensesAmount','DESC']]
        });
        console.log(leaderboardUsers);
        res.status(200).json(leaderboardUsers);
      }
      catch(err){
        res.status(401).json({success:'false'});
      }
  }