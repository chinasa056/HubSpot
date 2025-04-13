const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/dbConnect');

class User extends Model { }

User.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false

    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('profileImage');
        try {
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          return []; // fallback if somehow stored invalid JSON
        }
      },
      set(value) {
        this.setDataValue('profileImage', JSON.stringify(value));
    },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    timestamps: true,
  },
);

module.exports = User
