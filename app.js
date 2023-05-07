const express = require('express')
const bodyParser = require('body-parser') 
const cors = require('cors')
const app = express() 
const fs = require('fs')
const path = require('path')

app.use(cors()) 

// const helmet  =require('helmet')
const compression =require('compression')
const morgan = require('morgan')


const sequelize = require('./util/database')
const userRoutes = require('./Routes/user')
 

const ETable = require('./models/expenseTable')
const myTable = require('./models/userTable')
const OTable = require('./models/orderTable')
const forgotPassword = require('./models/forgotPTable');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags:'a'}
)

app.use(bodyParser.json({extended: false})) 

app.use(userRoutes) 


// app.use(helmet())
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))



myTable.hasMany(ETable)  // these 2 lines are for establishing the relation between the usertable and expensetable.
ETable.belongsTo(myTable) // we have to put the primary key of user table as a foriegn key in expense table.

myTable.hasMany(OTable)  
OTable.belongsTo(myTable)

myTable.hasMany(forgotPassword);
forgotPassword.belongsTo(myTable);

sequelize.sync().then(() => {
    app.listen(4000)
})
.catch((err) => console.log(err))