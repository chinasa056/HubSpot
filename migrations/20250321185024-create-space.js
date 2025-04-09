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
      pricePerHour: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      pricePerDay: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amenities: {
        type: Sequelize.JSON,
        allowNull: false
      },
      availability: {
        type: Sequelize.JSON,
        allowNull: false
      },
      locationId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      hostId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      spaceImages: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      listingStatus: {
        type: Sequelize.ENUM,
        values: ['active', 'pending', 'rejected'],
        defaultValue: 'pending',
      },
      averageRating: {
        type: Sequelize.FLOAT,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      bookingCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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