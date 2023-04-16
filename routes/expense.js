const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/auth')
const expenseController = require('../controller/expense')

router.post("/post-expense",userAuthentication, expenseController.postExpense)

router.get('/download', userAuthentication, expenseController.downloadExpense)

router.get('/get-expense',userAuthentication, expenseController.getExpense)

router.delete('/delete-expense/:id',userAuthentication,expenseController.deleteExpense)

module.exports = router