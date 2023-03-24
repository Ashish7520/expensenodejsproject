const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    expense : Sequelize.INTEGER,
    descreption : Sequelize.STRING,
    catagory : Sequelize.STRING
})

module.exports = Expense