const jsw = require('jsonwebtoken')
const User = require('../model/User')

const authenticate = (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jsw.verify(token,'jksjdfjkdkgjfljg5412154sghjshjvc556dfdjjv')
        console.log('userId------->>>>>>>>',user.userId)
        User.findByPk(user.userId).then(user=>{
            req.user = user
            next()
        }).catch(err=>{
            console.log(err)
            return res.status(401).json({success:false})
        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({success:false})
    }
}

module.exports = authenticate