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
    password: {
        type: Sequelize.STRING,
        
    },
    isPremiumUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
        
    },
    totalExpenses:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
},
{
    timestamps: false
}
)   

module.exports = userTable