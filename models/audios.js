'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Audios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Audios.belongsTo(models.Users, { foreignKey: 'userId' });
      Audios.belongsTo(models.Posts, { foreignKey: 'postId' });
    }
  }
  Audios.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    postId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      references: {
        model: {
          tableName: "Posts",
        },
        key: "id",
      }
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: {
          tableName: "Users",
        },
        key: "id",
      }
    }
  }, {
    sequelize,
    modelName: 'Audios',
  });
  return Audios;
};