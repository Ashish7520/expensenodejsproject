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
const userAuthentication  =  require('./middleware/auth')

app.post("/user/signup", async (req, res, next) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await User.create({
        username: username,
        email: email,
        password: hash,
      });
      res.status(201).json({ massage: "user created successfully" });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

function generateAccessToken(id,username){
  return jwt.sign({userId:id, username:username},'jksjdfjkdkgjfljg5412154sghjshjvc556dfdjjv')
}

app.post("/user/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    User.findAll({ where: { email } }).then((user) => {
      if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (!err) {
            res
              .status(200)
              .json({ success: true, massage: "user logged successfully",token:generateAccessToken(user[0].id,user[0].username) });
          } else {
            return res
              .status(400)
              .json({ success: false, massage: "Password is incorrect" });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, massage: "User does not exist" });
      }
    });
  } catch (error) {
    res.status(505).json({ massage: error, success: false });
  }
});

app.post("/user/post-expense",userAuthentication, async (req, res, next) => {
  try {
    const expense = req.body.expense;
  const descreption = req.body.descreption;
  const catagory = req.body.catagory;
  console.log(expense, descreption, catagory);
 const expenseDetail =  await Expense.create({
    expense: expense,
    descreption: descreption,
    catagory: catagory,
    userId:req.user.id
  });
  res.status(200).json({expenseDetail:expenseDetail})
  } catch (err) {
    res.status(404).json({err:err})
  }
  
});

app.get('/user/get-expense',userAuthentication,async(req,res,next)=>{
  try {
    const allExpense = await Expense.findAll({where:{userId:req.user.id}})
  res.json({expense:allExpense})
  } catch (error) {
    console.log(error)
    res.status(404).json({error:error})
  }
  
})

app.delete('/user/delete-expense/:id',userAuthentication,async(req,res,next)=>{
  console.log(req.params);
  try {
      console.log(req.params);
      const id = req.params.id;
      const product = await Expense.destroy({ where: { id: id,userId:req.user.id} }).then(noofrow=>{
        if(noofrow===0){
          return res.status(404).json({success:false, massage:'expense belongs to other user'})
        }
        res.json(product)
      })
      
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
})

User.hasMany(Expense)
Expense.belongsTo(User)

sequelize
  .sync()
  .then((result) => {
    app.listen(3501);
  })
  .catch((err) => {
    console.log(err);
  });
