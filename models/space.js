const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../database/dbConnect");
const Location = require('./location');
const Category = require('./category');
const Booking = require('./booking');

class Space extends Model { }

Space.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false
    },

    price: {
      type: DataTypes.NUMBER,
      allowNull: false
    },

    amenties: {
      type: DataTypes.STRING,
      allowNull: false
    },

    availability: {
      type: DataTypes.STRING,
      allowNull: false
    },

    locationId: {
      type: DataTypes.UUID,
      references: {
        model: 'Location',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: 'Cateory',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    hostId: {
      type: DataTypes.UUID,
      references: {
        model: 'Host',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    spaceImages: {
      type: DataTypes.JSON, // JSON type to store multiple URLs
      allowNull: true,
    },

  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Space', // We need to choose the model name
    timestamps: true,
  },
);

Space.belongsTo(Location, { foreignKey: 'locationId' });
Space.belongsTo(Category, { foreignKey: 'categoryId' });
Space.belongsTo(Host, { foreignKey: 'hostId' });
Space.hasMany(Booking, { foreignKey: 'spaceId' });


module.exports = Space
