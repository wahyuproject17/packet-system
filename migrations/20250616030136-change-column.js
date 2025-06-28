'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Histories', 'entry_date');
    await queryInterface.removeColumn('Histories', 'exit_date');
    await queryInterface.removeColumn('Histories', 'courier_photo');
    await queryInterface.removeColumn('Histories', 'user_photo');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Histories', 'entry_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn('Histories', 'exit_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn('Histories', 'courier_photo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Histories', 'user_photo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
