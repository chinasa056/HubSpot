const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require("../database/dbConnect");
const Location = require('./location');
const Category = require('./category');
const Booking = require('./booking');
const Review = require('./review_rating');

class Space extends Model { }

Space.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    overView: {
      type: DataTypes.STRING,
      allowNull: false
    },

    pricePerHour: {
      type: DataTypes.NUMBER,
      allowNull: false
    },

    pricePerDay: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    
    capacity: {
      type: DataTypes.NUMBER,
      allowNull: false
    },

    amenities: {
      type: DataTypes.JSON,
      allowNull: false
    },

    availability: {
      type: DataTypes.JSON,
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
      allowNull: false,
    },
    averageRating: {
      type: DataTypes.FLOAT, // This allows storing multiple image URLs in a JSON array
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
Space.hasMany(Review, { foreignKey: 'spaceId' });
Space.hasMany(Booking, { foreignKey: 'spaceId' });


module.exports = Space
