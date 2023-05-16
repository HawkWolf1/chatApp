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
const myGroupTable = require('./models/groupTable');
const myUsersGroupTable = require('./models/usergroupTable')
 

app.use(bodyParser.json({extended: false})) 

app.use(userRoutes) 



myTable.hasMany(chatTable);
chatTable.belongsTo(myTable);

myGroupTable.hasMany(chatTable);
chatTable.belongsTo(myGroupTable);

myGroupTable.belongsToMany(myTable, { through: myUsersGroupTable });
myTable.belongsToMany(myGroupTable, { through: myUsersGroupTable });




sequelize.sync().then(() => {
    app.listen(4000)
})
.catch((err) => console.log(err))