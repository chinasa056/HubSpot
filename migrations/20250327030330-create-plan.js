'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Plan', {
       id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
          },
          
          planName: {
            type: Sequelize.STRING,
            allowNull: false
          },
      
          amount: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
      
          description: {
            type: Sequelize.STRING,
            allowNull: true,
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
    await queryInterface.dropTable('Plan');
  }
};