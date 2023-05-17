const express = require('express');

const router = express.Router();


const userController = require('../controllers/userC')
const msgController = require('../controllers/messageC')
const groupController = require('../controllers/groupC')

const userAuthentication = require('../middleware/auth')


router.post('/user/add-user',  userController.addUser)
router.post('/user/login', userController.loginN)

router.post('/user/sendMessage',userAuthentication.authenticate, msgController.sendMessage)
router.get('/user/getChats',userAuthentication.authenticate, msgController.getMessage)
router.get('/user/members',userAuthentication.authenticate, msgController.getUsers)

router.post('/group/create',userAuthentication.authenticate, groupController.createGroup)
router.get('/user/all', groupController.fetchMembers)
router.get('/group/showAll',userAuthentication.authenticate,groupController.showGroups )
router.get('/group/getGroupLink/:groupId',userAuthentication.authenticate, groupController.showGroups )



module.exports = router