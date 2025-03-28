const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");
const Space = require('./space');
const User = require('./user')

class Booking extends Model {}

Booking.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },

    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    spaceId: {
      type: DataTypes.UUID,
      references: {
        model: 'Space',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    bookingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },

    checkin: {
      type: DataTypes.NUMBER,
      allowNull: true
    },

    checkout: {
      type: DataTypes.NUMBER,
      allowNull: true
    },

    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Confirmed"
    },

  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Booking', // We need to choose the model name
    timestamps: true,
  },
);

Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Space, { foreignKey: 'spaceId' });

module.exports = Booking
