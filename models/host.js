const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/dbConnect');
class Host extends Model {}

Host.init(
  {id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: UUIDV4
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false
  },

  companyName: {
    type: DataTypes.STRING,
    allowNull: true
  },

  companyAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },

  tpyeOfSpace: {
    type: DataTypes.STRING,
    allowNull: false
  },

  identification: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  profileImage: {
    type: DataTypes.JSON, // This allows storing multiple image URLs in a JSON array
    allowNull: true,
  },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Host', // We need to choose the model name
    timestamps: true,
  },
);

module.exports = Host
