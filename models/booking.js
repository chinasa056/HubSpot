const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");
// const Space = require('./space');
// const User = require('./user')

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
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    spaceId: {
      type: DataTypes.UUID,
      references: {
        model: 'Spaces',
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
      type: DataTypes.INTEGER,
      allowNull: true
    },

    checkout: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM,
      values: ['active', 'pending', 'expired'], 
      defaultValue: 'pending', 
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Booking', // We need to choose the model name
    timestamps: true,
  },
);

// Booking.belongsTo(User, { foreignKey: 'userId' });
// Booking.belongsTo(Space, { foreignKey: 'spaceId' });

module.exports = Booking
