'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.addColumn("Users", "nickname", {
      allowNull: false, // NOT NULL
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {

    return queryInterface.removeColumn("Users", "nickname");
  },
};
