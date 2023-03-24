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

app.post("/user/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    User.findAll({ where: { email } }).then((user) => {
      if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (!err) {
            res
              .status(200)
              .json({ success: true, massage: "user logged successfully" });
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

app.post("/user/post-expense", async (req, res, next) => {
  try {
    const expense = req.body.expense;
  const descreption = req.body.descreption;
  const catagory = req.body.catagory;
  console.log(expense, descreption, catagory);
 const expenseDetail =  await Expense.create({
    expense: expense,
    descreption: descreption,
    catagory: catagory,
  });
  res.status(200).json({expenseDetail:expenseDetail})
  } catch (err) {
    res.status(404).json({err:err})
  }
  
});

app.get('/user/get-expense',async(req,res,next)=>{
  try {
    const allExpense = await Expense.findAll()
  res.json({expense:allExpense})
  } catch (error) {
    console.log(error)
    res.status(404).json({error:error})
  }
  
})

app.delete('user/delete-expense/:id',async(req,res,next)=>{
  console.log(req.params);
  try {
      console.log(req.params);
      const id = req.params.id;
      const product = await Expense.destroy({ where: { id: id } });
      res.json(product)
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
})

sequelize
  .sync()
  .then((result) => {
    app.listen(3501);
  })
  .catch((err) => {
    console.log(err);
  });
