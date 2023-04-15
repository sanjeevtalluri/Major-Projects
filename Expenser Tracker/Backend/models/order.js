const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Order = sequelize.define('order',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  orderId:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  paymentId:{
    type:Sequelize.STRING,
    defaultValue: '',
    allowNull:true
  },
  status:{
    type:Sequelize.STRING,
    allowNull: false,
  }
})

module.exports = Order;
