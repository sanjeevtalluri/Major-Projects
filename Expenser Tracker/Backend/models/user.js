const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const User = sequelize.define('user',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  email:{
    type:Sequelize.STRING,
    allowNull: false,
    unique:true
  },
  password:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  isPremiumUser:{
    type:Sequelize.BOOLEAN,
    defaultValue:0
  },
  totalExpensesAmount:{
    type:Sequelize.DOUBLE,
    defaultValue:0
  }
})

module.exports = User;
