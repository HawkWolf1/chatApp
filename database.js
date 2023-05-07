const Sequelize = require('sequelize')

require('dotenv').config() 

const sequelize = new Sequelize('practise', 'root', process.env.GIT_PWD, {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize