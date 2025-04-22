module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Spaces', 'spaceAddress', {
      type: Sequelize.STRING,
      allowNull: false, // Adjust as needed
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Spaces', 'spaceAddress');
},
};