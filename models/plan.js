const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");
const Subscription = require('./subscription');

class Plan extends Model {}

Plan.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    
    planName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    amount: {
      type: DataTypes.INTEGER,
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
    modelName: 'Plan', // We need to choose the model name
    timestamps: true,
  },
);

Plan.hasMany(Subscription, { foreignKey: 'PlanId'});

module.exports = Plan
