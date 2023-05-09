const Sequelize = require('sequelize')

const sequelize = require('../util/database')


const msgTable = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    name: {
        type: Sequelize.STRING,
    },
    message:{
        type: Sequelize.STRING
    }
    
    
},
{
    timestamps: false
}
)   

module.exports = msgTable