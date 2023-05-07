const Sequelize = require('sequelize')

const sequelize = require('../util/database')


const userTable = sequelize.define('ourUser', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    name: {
        type: Sequelize.STRING,
    },
    
    email: {
        type: Sequelize.STRING,
        unique: true

    },
    phoneNo: {
        type: Sequelize.INTEGER,

    },
    password: {
        type: Sequelize.STRING,
        
    }
    
},
{
    timestamps: false
}
)   

module.exports = userTable