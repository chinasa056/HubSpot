const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");
const Space = require('./space');

class Category extends Model {}

Category.init(
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

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Category', // We need to choose the model name
    timestamps: true,
  },
);

Category.hasMany(Space, { foreignKey: 'categoryId'});

module.exports = Category
