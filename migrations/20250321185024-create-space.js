'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spaces', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.NUMBER,
        allowNull: false
      },
      amenties: {
        type: Sequelize.STRING,
        allowNull: false
      },
      availability: {
        type: Sequelize.STRING,
        allowNull: false
      },
      locationId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hostId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      spaceImages: {
        type: Sequelize.JSON, // This allows storing multiple image URLs in a JSON array
        allowNull: false,
      },
      averageRating: {
        type: Sequelize.FLOAT, // This allows storing multiple image URLs in a JSON array
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spaces');
  }
};