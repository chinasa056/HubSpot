const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");

class Payment extends Model {}

Payment.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    hostId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    hostName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['success', 'processing', 'failed'],
      defaultValue: 'processing',
    },

    paynemtDate: {
      type: DataTypes.DATE,
      allowNull: false,
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
    modelName: 'Payment',
    timestamps: true,
  },
);

module.exports = Payment;
