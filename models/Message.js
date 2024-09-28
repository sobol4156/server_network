// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Message = sequelize.define('Message', {
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Message;
