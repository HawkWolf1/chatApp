const express = require('express');

const router = express.Router();

// //limiter is being added becasue getting error 429(too many requests)
// const rateLimit = require("express-rate-limit");
// const limiter = rateLimit({
//     windowMs: 5 * 60 * 1000, // 15 minutes
//     max: 15, // limit each IP to 100 requests per windowMs
//   });

const userController = require('../controllers/userC')
const expenseController = require('../controllers/expenseC')
const userAuthentication = require('../middleware/auth')
const purchaseController = require('../controllers/purchaseC')
const premiumLeaderboardController = require('../controllers/premiumFeatureLeaderboard')
const resetpasswordController = require('../controllers/forgotP');

router.post('/user/add-user',  userController.addUser)
router.post('/user/login', userController.loginN)


router.post('/expense/add-expense', userAuthentication.authenticate, expenseController.addExpense)
router.get('/expense/get-expense', userAuthentication.authenticate, expenseController.getExpense)
router.delete('/expense/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense)

router.get('/purchase/premiummembership', userAuthentication.authenticate, purchaseController.purchasePremium)
router.post('/purchase/updatetransactionstatus', userAuthentication.authenticate, purchaseController.updateTransactionStatus)

router.get('/premium/showleaderboard', userAuthentication.authenticate, premiumLeaderboardController.fetchUserLeaderBoard)

router.post('/password/forgotpassword', resetpasswordController.forgotMyP)
router.get('/password/resetpassword/:id', resetpasswordController.resetMyP)
router.get('/password/updatepassword/:id', resetpasswordController.updateMyP)


router.get('/user/download', userAuthentication.authenticate, expenseController.downloadExpense)

module.exports = router