const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");

class Location extends Model {}

Location.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Location', // We need to choose the model name
    timestamps: true,
  },
);

module.exports = Location
