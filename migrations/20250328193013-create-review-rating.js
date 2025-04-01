'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Review_Ratings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
  
      spaceId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
  
      spaceName: {
        type: Sequelize.STRING,
        allowNull: false
      },
  
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        },
  
      userName: {
        type: Sequelize.STRING,
        allowNull: false
      },
  
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
  
      reviewText: {
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
    await queryInterface.dropTable('Review_Ratings');
  }
};