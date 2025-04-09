const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");

class Category extends Model { }

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
    sequelize,
    modelName: 'Category',
    timestamps: true,
  },
);

// Association defined after model initialization to break circular dependency
// Category.hasMany(require('./space'), { foreignKey: 'categoryId'});

module.exports = Category;
