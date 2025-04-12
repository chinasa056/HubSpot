const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/dbConnect');
// const Space = require('./space'); // Import Space here
// const Subscription = require('./subscription'); // Import Subscription here

class Host extends Model { }

Host.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    companyAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    meansOfIdentification: {
      type: DataTypes.ENUM,
      values: ["Nin", "Passport", "Driver's License"],
    },

    idCardNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    ninImage: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    profileImage: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bankAccountNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    bankAccountName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    currentBalance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    subscriptionExpired: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
    },
    subscription: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    isLoggedin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    sequelize, // We need to pass the connection instance
    modelName: 'Host', // We need to choose the model name
    timestamps: true,
  }
);

// // Host has many Spaces
// Host.hasMany(Space, { foreignKey: 'hostId' });

// // Host has many Subscriptions
// Host.hasMany(Subscription, { foreignKey: 'hostId' });

module.exports = Host;
