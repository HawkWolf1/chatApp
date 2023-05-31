const Sequelize = require('sequelize')

const sequelize = require('../util/database')


const aMsgTable = sequelize.define('archivedMessage', {
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
    },
    archiveDate: {
        type: Sequelize.DATE
      },
    
    
},
{
    timestamps: true
}
)   

module.exports = aMsgTable