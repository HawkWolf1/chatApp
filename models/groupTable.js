const Sequelize = require('sequelize')

const sequelize = require('../util/database')
const { isNull } = require('util')


const grpTable = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        
    },
    
    groupName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
    members:{
        type: Sequelize.STRING,
        allowNull: false

    },

    grouplink: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
    },
    admin:
    {  type:Sequelize.INTEGER,
        allowNull: false,
        

    }
    
    
},
{
    timestamps: true
}
)   

module.exports = grpTable