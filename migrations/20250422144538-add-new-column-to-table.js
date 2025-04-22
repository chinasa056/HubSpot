module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Hosts', 'bankCode', {
      type: Sequelize.STRING,
      allowNull: false, // Adjust as needed
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Hosts', 'bankCode');
},
};