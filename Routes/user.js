const express = require('express');

const router = express.Router();


const userController = require('../controllers/userC')
const msgController = require('../controllers/messageC')


router.post('/user/add-user',  userController.addUser)
router.post('/user/login', userController.loginN)

router.post('/user/sendMessage', msgController.sendMessage)


module.exports = router