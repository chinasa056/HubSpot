'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      spaceId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      bookingDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      duration: {
        type: Sequelize.NUMBER,
        allowNull: true
      },
      status: {
        type: Sequelize.NUMBER,
        allowNull: true
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
    await queryInterface.dropTable('Bookings');
  }
};