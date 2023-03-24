const http = require('http')
const express = require('express')
const app = express();
const User = require('./model/User');
const sequelize = require('./util/database');
const bodyparser = require('body-parser')
app.use(bodyparser.json());
const cors = require('cors')
app.use(cors());


app.post('/user/signup',(req,res,next)=>{
    try {
        const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    //console.log('username',username,'email',email,'password',password)
    User.create({username:username,email:email,password:password}).then(()=>{
        res.status(201).json({massage : 'user created successfully'})
    }).catch(err=>{
        res.status(500).json(err)
    })
    } catch (error) {
        console.log(error)
    }
    
})
sequelize.sync().then(result=>{
    app.listen(3500);
}).catch(err=>{
    console.log(err)
})
