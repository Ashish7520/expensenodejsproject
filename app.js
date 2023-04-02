const http = require("http");
const Sequelize = require('sequelize')

const express = require("express");
const app = express();

const sequelize = require("./util/database");

const bodyparser = require("body-parser");
app.use(bodyparser.json());

const cors = require("cors");
app.use(cors());

require('dotenv').config();

const User = require("./model/User");
const Expense = require("./model/Expense");
const Order = require('./model/order');
const userAuthantication = require('./middleware/auth')

const userRoutes = require('./routes/user')
app.use('/user',userRoutes)

const expenseRoutes = require('./routes/expense')
app.use('/user', expenseRoutes)

const purchaseRoutes = require('./routes/purchase')
app.use('/purchase', purchaseRoutes)

const jwt = require('jsonwebtoken')


app.get('/purchase/get-leaderboard', async(req,res,next)=>{
  try {
    const leaderboardOfUsers =await User.findAll({
      attributes : ['id','username',[sequelize.fn('sum', sequelize.col('expense')), 'total_cost']],
      include:[{
        model:Expense,
        attributes:[]
      }],
      group:['user.id'],
      order:[['total_cost','DESC']]
    })
    // const expenses =await Expense.findAll({
    //   attributes: ['userId',[sequelize.fn('sum', sequelize.col('expense')), 'total_cost']],
    //   group:['userId']

    //       })
    // const userAggregatedExpenses = {}
    // expenses.forEach((expenseAmount) => {
    //   if(userAggregatedExpenses[expenseAmount.userId] ){
    //     userAggregatedExpenses[expenseAmount.userId] = userAggregatedExpenses[expenseAmount.userId] + expenseAmount.expense
    //   }else{
    //     userAggregatedExpenses[expenseAmount.userId] = expenseAmount.expense
    //   }
      
    // });
    // var userLeaderBoardDetails = []
    // users.forEach((user)=>{
    //   userLeaderBoardDetails.push({name:user.username, total_cost:userAggregatedExpenses[user.id]||0})
    // })
    // console.log("userAggregatedExpenses",userLeaderBoardDetails)
    // userLeaderBoardDetails.sort((a,b)=> b.total_cost - a.total_cost)
    res.status(200).json(leaderboardOfUsers)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

sequelize
  .sync()
  .then((result) => {
    app.listen(3501);
  })
  .catch((err) => {
    console.log(err);
  });
