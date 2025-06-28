const { Sequelize, DataTypes, Model, UUIDV4, BOOLEAN } = require('sequelize');
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
    hostId: {
      type: DataTypes.UUID,
      references: {
        model: "Hosts",
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    overview: {
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
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const raw = this.getDataValue('amenities');
        try {
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          return [];
        }
      },
      set(value) {
        this.setDataValue('amenities', JSON.stringify(value));
      }
    },
    availability: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const raw = this.getDataValue('availability');
        try {
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          return []; // fallback if somehow stored invalid JSON
        }
      },
      set(value) {
        this.setDataValue('availability', JSON.stringify(value));
      },
    },
    spaceType: {
      type: DataTypes.ENUM,
      values: ['cowork hub', 'creative space'],
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: false, // No default value, can be null
      get() {
        const raw = this.getDataValue('images');
        try {
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          return []; // fallback if somehow stored invalid JSON
        }
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value));
      },
    },
    listingStatus: {
      type: DataTypes.ENUM,
      values: ['active', 'pending', 'rejected'],
      defaultValue: 'pending',
    },
    spaceAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    averageRating: {
      type: DataTypes.FLOAT,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    bookingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isApproved: {
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

// npx sequelize-cli db:migrate:undo --name 20250321185024-create-space.js
