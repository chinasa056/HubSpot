const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/dbConnect');
// const Location = require('./location');
// const Host = require('./host');
// const Review = require('./review_rating');

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
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pricePerHour: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pricePerDay: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
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
        model: "Locations",
        key: 'id'
      },
      onUpdate: 'CASCADE',
     // onDelete: 'CASCADE'
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: "Categories",
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    spaceImages: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    listingStatus: {
      type: DataTypes.ENUM,
      values: ['active', 'pending','rejected'],
      defaultValue: 'pending',
    },
    averageRating: {
      type: DataTypes.FLOAT,
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
    modelName: 'Space',
    timestamps: true,
  },
);

// Space.belongsTo(Location, { foreignKey: "locationId" });
// Space.belongsTo(require('./category'), { foreignKey: "categoryId" });
// Space.belongsTo(Host, { foreignKey: "hostId" });
// Space.hasMany(Review, { foreignKey: "spaceId" });

module.exports = Space;
