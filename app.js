const express = require('express')
const bodyParser = require('body-parser') 
const cors = require('cors')
const app = express() 

app.use(cors({
    origin: "*"
})) 


const sequelize = require('./util/database')
const userRoutes = require('./Routes/user')

const myTable = require('./models/userTable')
const chatTable = require('./models/messageTable')
 

app.use(bodyParser.json({extended: false})) 

app.use(userRoutes) 



myTable.hasMany(chatTable);
chatTable.belongsTo(myTable);


sequelize.sync().then(() => {
    app.listen(4000)
})
.catch((err) => console.log(err))