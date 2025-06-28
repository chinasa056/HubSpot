module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Spaces', 'initialCapacity', {
      type: Sequelize.INTEGER,
      allowNull: false, // Adjust as needed
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Spaces', 'initialCapacity');
},
};