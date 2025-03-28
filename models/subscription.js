const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../database/dbConnect');
const Space = require('./space');
class Subscription extends Model { }

Subscription.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },

    hostId: {
      type: DataTypes.UUID
    },

    spaceName: {
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
      allowNulld: true
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

Subscription.belongsTo(Space, { foreignKey: 'spaceId' });
Subscription.belongsTo(Host, { foreignKey: 'userId' });

module.exports = Subscription;



sequelize.define('foo', {
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'pending', 'expired'],
  },
});