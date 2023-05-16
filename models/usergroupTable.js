const Sequelize = require('sequelize')

const sequelize = require('../util/database')




const grp_usersTable = sequelize.define('groups/users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  });


  module.exports = grp_usersTable