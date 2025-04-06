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

      StartDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },

      checkinTime: {
        type: Sequelize.TIME,
        allowNull: false
      },

      checkoutTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      status: {
        type: DataTypes.ENUM,
        values: ['active', 'pending', 'expired'],
        defaultValue: 'pending',
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