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
        allowNull: true
      },
      companyAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tpyeOfSpace: {
        type: Sequelize.STRING,
        allowNull: false
      },
      identification: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profileImage: {
        type: Sequelize.JSON,
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