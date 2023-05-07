const express = require('express');

const router = express.Router();


const userController = require('../controllers/userC')


router.post('/user/add-user',  userController.addUser)
router.post('/user/login', userController.loginN)




module.exports = router