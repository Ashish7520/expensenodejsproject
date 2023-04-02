const Expense = require('../model/Expense');
const User = require('../model/User');
const sequelize = require('../util/database')


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
        const allExpense = await Expense.findAll({where:{userId:req.user.id}})
        res.json({expense:allExpense})
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


module.exports = { postExpense, getExpense, deleteExpense };
