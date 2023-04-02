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
      order:[['totalExpenses','DESC']]
    })
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
