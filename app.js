const http = require("http");
const Sequelize = require('sequelize')
const Sib = require('sib-api-v3-sdk')
const Forgotpassword = require('./model/forgotPassword');


const express = require("express");
const app = express();

const sequelize = require("./util/database");

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

require('dotenv').config();



const User = require("./model/User");
const Expense = require("./model/Expense");
const Order = require('./model/order');
const userAuthantication = require('./middleware/auth')
const resetPasswordRoutes = require('./routes/resetpassword')

const userRoutes = require('./routes/user')
app.use('/user',userRoutes)

const expenseRoutes = require('./routes/expense')
app.use('/user', expenseRoutes)

const purchaseRoutes = require('./routes/purchase')
app.use('/purchase', purchaseRoutes)

const jwt = require('jsonwebtoken')

// app.post('/password/forgotpassword', (req,res,next)=>{

//   const client = Sib.ApiClient.instance;
//   const apiKey = client.authentications['api-key'];
//   apiKey.apiKey = process.env.API_KEY;
  
//   const transEmailApi = new Sib.TransactionalEmailsApi();
//   const sender = {
//     email: 'ashishnandwana2@gmail.com'
//   };
  
//   const receivers = [
//     {
//       email: 'ashishnandvana123@gmail.com'
//     }
//   ];
  
//   transEmailApi.sendTransacEmail({
//     sender,
//     to: receivers,
//     subject: 'Forgot your password, do not worry',
//     textContent: 'hello from forgot password'
//   }).then(console.log)
//   .catch(console.log);
// })

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

app.use('/password', resetPasswordRoutes);

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    app.listen(3501);
  })
  .catch((err) => {
    console.log(err);
  });
