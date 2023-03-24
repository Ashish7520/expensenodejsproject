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
        bcrypt.compare(password,user[0].password,(err,result)=>{
          if(!err){
            res
            .status(200)
            .json({ success: true, massage: "user logged successfully" });
          } else {
            return res
              .status(400)
              .json({ success: false, massage: "Password is incorrect" });
          }
        })
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

sequelize
  .sync()
  .then((result) => {
    app.listen(3501);
  })
  .catch((err) => {
    console.log(err);
  });
