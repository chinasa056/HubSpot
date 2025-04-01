'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      hostId: {
        type: Sequelize.UUID
      },
      planId: {
        type: Sequelize.UUID
      },
      planName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['active', 'pending', 'expired'],
        defaultValue: 'pending',
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      paymentDate: {
        type: Sequelize.STRING,
        allowNulld: true
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
    await queryInterface.dropTable('Subscriptions');
  }
};