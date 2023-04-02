const Expense = require('../model/Expense');
const User = require('../model/User');


const postExpense = async (req, res, next) => {
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
        const totalExpense = Number(req.user.totalExpenses)+Number(expense)
        console.log(totalExpense)
        User.update({totalExpenses:totalExpense},{
            where:{id:req.user.id}
        })
        res.status(200).json({expenseDetail:expenseDetail})
    } catch (err) {
        res.status(404).json({err:err})
    }
};

const getExpense = async (req,res,next) => {
    try {
        const allExpense = await Expense.findAll({where:{userId:req.user.id}})
        res.json({expense:allExpense})
    } catch (error) {
        console.log(error)
        res.status(404).json({error:error})
    }
};

const deleteExpense = async (req,res,next) => {
    console.log(req.params);
    try {
        const id = req.params.id;
        const product = await Expense.destroy({ where: { id: id,userId:req.user.id} }).then(noofrow=>{
            if(noofrow===0){
                return res.status(404).json({success:false, massage:'expense belongs to other user'})
            }
            res.json(product)
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { postExpense, getExpense, deleteExpense };
