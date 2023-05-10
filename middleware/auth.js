const jwt = require('jsonwebtoken')
const User = require('../models/userTable')

const authenticate = async (req,res,next) => {

    try {
        const token = req.header('Authorization')
        console.log(token)
        const user = jwt.verify(token, 'Rockettt')
        console.log(user.userId)
        const newUser = await User.findByPk(user.userId)
            console.log(JSON.stringify(newUser))

            req.user = newUser // global key being attached to the user
            next()  // next is used to flow to next function which is expenseController.getExpense
        }catch(err) {
        console.log(err)
        return res.status(401).json({success:false})
    }
}

module.exports = {
    authenticate
}