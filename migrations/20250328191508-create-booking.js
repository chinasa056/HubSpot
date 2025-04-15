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
      userName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      spaceName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      durationPerDay: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      durationPerHour: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      StartDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },

      checkinTime: {
        type: Sequelize.TIME,
        allowNull: false
      },

      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM,
        values: ['active', 'pending', 'expired', 'upcoming', 'failed'],
        defaultValue: 'pending',
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      paymentDate: {
        type: Sequelize.STRING,
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