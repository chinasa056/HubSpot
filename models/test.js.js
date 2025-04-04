const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");

class Test extends Model {}

Test.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true,
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
    modelName: 'Test',
    timestamps: true,
  },
);

// Association defined after model initialization to break circular dependency
// Test.hasMany(require('./space'), { foreignKey: 'TestId'});

module.exports = Test;
