const{Sequelize,DataTypes,Model}= require('sequelize');
const sequelize = require('../database/sequelize');

class User extends Model { }

User.init(
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    tableName: 'Users'
  },
);

module.exports = User;
