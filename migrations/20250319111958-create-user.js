'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
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
      gender:{
             type:Sequelize.ENUM('Male','Female'),
             allowNull:false
          },
      email: {
        type: Sequelize.STRING,
        allowNull: false

      },
      isVerified:{
              type:Sequelize.BOOLEAN,
              defaultValue:false
        },
        isLoggedin:{
              type:Sequelize.BOOLEAN,
              defaultValue:false
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
    await queryInterface.dropTable('Users');
  }
};