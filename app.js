const http = require("http");
const express = require("express");
const mysql = require("mysql2");
const app = express();
const bcrypt = require("bcrypt");
const User = require("./model/User");
const sequelize = require("./util/database");
const bodyparser = require("body-parser");
app.use(bodyparser.json());
const cors = require("cors");
app.use(cors());
const Expense = require("./model/Expense");
const jwt = require('jsonwebtoken');
const userAuthentication  =  require('./middleware/auth');
const Razorpay = require('razorpay');
const Order = require('./model/order');
const { error } = require("console");
require('dotenv').config();

const bodyParser = require("body-parser");
app.use(bodyParser.json())

const userRoutes = require('./routes/user')
app.use('/user',userRoutes)

const expenseRoutes = require('./routes/expense')
app.use('/user', expenseRoutes)

const purchaseRoutes = require('./routes/purchase')
app.use('/purchase', purchaseRoutes)


// app.get('/purchase/premiummembership',userAuthentication, async(req,res,next)=>{
//      try {
//       var rzp = new Razorpay({
//         key_id : process.env.RAZORPAY_KEY_ID,
//         key_secret:process.env.RAZORPAY_KEY_SECRET
//       })


//       const amount = 2500;
      
      
//       rzp.orders.create({"amount":amount,"currency":"INR"},(err,order)=>{
//         if(err){
//           throw new Error(JSON.stringify(err))
//         }
//         req.user.createOrder({orderid:order.id,status:'PENDING'}).then(()=>{
//           return res.status(201).json({order, key_id: rzp.key_id})
//         })
//         .catch(err=>{
//           throw new Error(err)
//         })
//       })
//      } catch (err) {
//       console.log(err)
//       res.status(403).json({massage:'something went wrong', error:err})
      
//      }
// })

// app.post('/purchase/updatetransactionstatus',userAuthentication, async(req,res,next)=>{
//   try {
//     const {payment_id , order_id} = req.body
//     console.log('reqatpost------>>>>>',req.body)
//    const order = await Order.findOne({where:{orderid:order_id}})
//     const promise1 = order.update({paymentid:payment_id,status:'successful'})
//     const promise2 =  req.user.update({isPremiumUser:true})
//     Promise.all([promise1,promise2]).then(()=>{
//       return res.status(202).json({success:true, massage:'transaction successful'})
//     }).catch(err=>{
//       throw new Error(err)
//     })

//       } catch (err) {
//     throw new Error(err)
//   }
// })

app.get('/purchase/get-leaderboard', async(req,res,next)=>{
  const expenses = await Expense.findAll()
 // console.log('expenses--------->>>>>>>>>', expenses)
  for(var i=0; i<expenses.length; i++){
    var abc = expenses[i]
  }
 // console.log('abc---->',abc)
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
