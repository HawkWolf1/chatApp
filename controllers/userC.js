const myTable = require('../models/userTable')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function checkString(str) {
    if(str == undefined || str.length === 0){
        return true
    } else{
        return false
    }
}

const addUser = async (req, res, next) => {
    try{
    const {name, email, phoneNo,  password} = req.body

    if(checkString(name) || checkString(email) || checkString(password) || checkString(phoneNo)){
        return res.status(400).json({ err: "Bad parameters . Something is missing"})
        }

    const existingUser = await myTable.findOne({ where: { email: email } })
    if(existingUser){
        return res.status(409).json({ message: 'User already exists!' })
    }
    
    const saltrounds =10
    bcrypt.hash(password, saltrounds, async(err, hash) =>{
        console.log(err)
       
    await myTable.create({ 
    name, 
    email, 
    phoneNo,
    password: hash })

    res.status(201).json({ message: 'New User created Successfully!' }) 
})
    }catch(err){
    res.status(500).json(err)
    }
}



function generateAccessToken(id){
    return jwt.sign({userId:id}, 'Rockettt')
}


const loginN = async (req, res, next) => {
    try{
    const {email, password} = req.body
    
    const xyz = await myTable.findAll({where :{email}})
        if(xyz.length >0){
            bcrypt.compare(password, xyz[0].password, (err,result) => {
                if(err){
                    res.status(500).json({success: false, message: 'We got some error'})
                }
                if(result===true){
                    res.status(200).json({success: true, message: 'Login is successful', token: generateAccessToken(xyz[0].id)})
                }
                else{
                  return res.status(400).json({success: false, message: 'Password is incorrect'})
                }
                
            })
           

        } else{
            return res.status(404).json({success: false, message: 'No such User exists'})
        }
    }catch(err){
        res.status(500).json({message: err, success: false})
    }
}



module.exports = {
    addUser,
    loginN
}