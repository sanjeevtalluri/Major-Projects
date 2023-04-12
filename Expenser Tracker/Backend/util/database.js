const Sequelize = require('sequelize');
const sequelize = new Sequelize('expense tracker full stack','root','root',{
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize;