const sequelize = require('../util/database');
const Sequelize = require('sequelize');


const FileDownload = sequelize.define('fileDownload',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  fileName:{
    type:Sequelize.STRING,
    allowNull: false,
  },

  fileUrl:{
    type:Sequelize.STRING,
    allowNull: false,
  }
})

module.exports = FileDownload;
