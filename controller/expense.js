const Expense = require('../model/Expense');
const User = require('../model/User');
const sequelize = require('../util/database')
const AWS = require('aws-sdk')
const jwt = require('jsonwebtoken')
const PRODUCTS_PER_PAGE = 3 


 function uploadToS3(data,fileName){
   const bucketName = process.env.BUCKET_NAME   //'expensetrackingapp007'
   const userKey = process.env.IAM_USER_KEY //'AKIATFVG4AANBVFGTXVN'
   const userSecretKey = process.env.IAM_USER_SECRET //'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'

   let s3bucket =  new AWS.S3({
    accessKeyId : userKey,
    secretAccessKey: userSecretKey
   })

  
    var params={
        Bucket:bucketName,
        Key:fileName,
        Body:data,
        ACL : 'public-read'
    }

     return new Promise((resolve, reject)=>{
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log('something went wrong',err)
                reject(err)
            }else{
                console.log('success',s3response)
                resolve(s3response.Location)
            }
        })
     })
   
}

const downloadExpense = async(req,res,next)=>{
    try{
        const expenses = await req.user.getExpenses()
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id
    const fileName = `Expense${userId}/${new Date}.txt`;
    const fileURL =await uploadToS3(stringifiedExpenses,fileName)
    res.status(200).json({fileURL,success:true})
    }catch(err){
        res.status(500).json({fileURL:'',success:false, err:err})
    }
}


const postExpense = async (req, res, next) => {
    const t = await sequelize.transaction();  
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
        },{
            transaction:t
        });
        const totalExpense = Number(req.user.totalExpenses)+Number(expense)
        console.log(totalExpense)
       await User.update({totalExpenses:totalExpense},{
            where:{id:req.user.id},
            transaction : t
        })
        await t.commit()
        res.status(200).json({expenseDetail:expenseDetail})
    } catch (err) {
        await t.rollback();
        res.status(404).json({err:err})
    }
};

const getExpense = async (req,res,next) => {
    try {
        const page = req.query.page || 1;
        const totalItems = await Expense.count({
            where: { userId: req.user.id }
          });
        const allExpense = await Expense.findAll({
            where:{userId:req.user.id},
            offset: (page-1)*PRODUCTS_PER_PAGE,
            limit:PRODUCTS_PER_PAGE
        })
        res.json({expense:allExpense,
        currentPage: page,
        hasNextPage:PRODUCTS_PER_PAGE*page<totalItems,
        nextPage:page+1,
        hasPreviousPage:page>1,
        previousPage:page-1,
        lastPage:Math.ceil(totalItems/PRODUCTS_PER_PAGE)
    })
    } catch (error) {
        console.log(error)
        res.status(404).json({error:error})
    }
};

const deleteExpense = async (req, res, next) => {
    console.log(req.params);
    const t = await sequelize.transaction();
    const id = req.params.id;
    const expenseOfSubs = await Expense.findOne({ where: { id: id, userId: req.user.id }});
        console.log("expense>>>>>>>>>",expenseOfSubs.expense)
    try {
        const id = req.params.id;
        const noOfRowsDeleted = await Expense.destroy({ where: { id: id, userId: req.user.id },transaction:t });
        if (noOfRowsDeleted === 0) {
            return res.status(404).json({ success: false, message: 'Expense belongs to other user' });
        }
        
        const totalExpense = Number(req.user.totalExpenses) - Number(expenseOfSubs.expense);

        console.log("totalExpense>>>>>>>>>>>>>>>",totalExpense)
        await User.update({totalExpenses:totalExpense},{
            where:{id:req.user.id},
            transaction:t
        })
        await t.commit();
        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


module.exports = { postExpense, getExpense, deleteExpense,downloadExpense };
