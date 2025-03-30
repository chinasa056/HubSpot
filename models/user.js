const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');

class User extends Model {}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4

    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false

    },
    gender:{
       type:DataTypes.ENUM('Male','Female'),
       allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false

    },
    isVerified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
  },
  isLoggedin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
  },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    timestamps: true,
  },
);

module.exports = User
