const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../database/dbConnect');

class Review extends Model {}

Review.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },

    spaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Spaces', 
        key: 'id',
      },
    },

    spaceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'id',
      },
    },

    userName: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: false,
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

// // Associations without importing the models directly
// Review.belongsTo('Space', { foreignKey: 'spaceId' });
// Review.belongsTo('User', { foreignKey: 'userId' });
// User.hasMany(Review, { foreignKey: 'userId' });

module.exports = Review;
