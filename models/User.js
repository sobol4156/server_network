const {DataTypes} = require('sequelize')
const sequelize = require("../db")

const User = sequelize.define("User", {
  name: {
    type:DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type:DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false
  },
  roles: {
    type: DataTypes.JSON,
    defaultValue: ['User']
  }
})

module.exports = User