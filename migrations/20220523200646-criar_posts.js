'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Posts', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: false,
      },
      subtitle: {
        type: Sequelize.DataTypes.STRING(1000),
        allowNull: false, 
      },
      text: {
        type: Sequelize.DataTypes.STRING(5000),
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        }
      },
      updatedAt: Sequelize.DataTypes.DATE,
      createdAt: Sequelize.DataTypes.DATE
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('Posts');
  }
};
