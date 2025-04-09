const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");

class Favorite extends Model {}

Favorite.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    spaceId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Favorite',
    timestamps: true,
  },
);

module.exports = Favorite;
