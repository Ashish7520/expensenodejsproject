const http = require('http')
const express = require('express')
const app = express();
app.use((req,res,next)=>{
    console.log('into the middleware')
})

app.listen(3500);