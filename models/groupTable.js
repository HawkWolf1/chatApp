const Sequelize = require('sequelize')

const sequelize = require('../util/database')


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

    // grouplink: {
    //     type: Sequelize.STRING,
    //     // defaultValue: ''
    // }
    
    
},
{
    timestamps: true
}
)   

module.exports = grpTable