'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hosts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      meansOfIdentification: {
        type: Sequelize.ENUM,
        values: ["Nin", "Passport", "Driver's License"]
      },
      idCardNumber: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      ninImage: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      profileImage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankAccountNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bankAccountName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      currentBalance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      subscriptionExpired: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
      subscription: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isLoggedin: {
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
    await queryInterface.dropTable('Hosts');
  }
};