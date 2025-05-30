const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require("../database/dbConnect");
// const Space = require('./space');
// const User = require('./user')

class Booking extends Model { }

Booking.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
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
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    spaceName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    durationPerDay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    durationPerHour: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },

    checkinTime: {
      type: DataTypes.TIME,
      allowNull: false
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM,
      values: ['active', 'pending', 'expired', 'upcoming', 'failed'],
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
