const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/dbConnect');
const Space = require('./space');
const User = require('./user');
class Review extends Model { }

Review.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },

    spaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Space,
        key: 'id',
      },
    },

    spaceName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },

    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, 
        max: 5, 
        isInt: true, 
      },
    },

    reviewText: {
      type: DataTypes.STRING, 
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: 'Review', // Name of the model
    tableName: 'Reviews', // Explicit table name
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(Space, { foreignKey: 'spaceId' });
Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = Review;
