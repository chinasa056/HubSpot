const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../database/dbConnect');
// const Plan = require('./plan');
// const Host = require('./host'); // Reference Host here

class Subscription extends Model {}

Subscription.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },
    hostId: {
      type: DataTypes.UUID,
      references: {
        model: "Hosts", 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    planId: {
      type: DataTypes.UUID,
      references: {
        model: "Plans", 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    planName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'pending', 'expired'], 
      defaultValue: 'pending', 
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: 'Subscription', // Name of the model
    tableName: 'Subscriptions', // Explicit table name
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// // Subscription belongs to Host
// Subscription.belongsTo(Host, { foreignKey: 'hostId' });
// Subscription.belongsTo(Plan, { foreignKey: 'planId' });

module.exports = Subscription;
