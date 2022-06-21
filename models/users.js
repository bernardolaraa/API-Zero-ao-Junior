'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Posts, {as: 'posts', foreignKey:'userId'});
      Users.hasMany(models.Audios, {as: 'audios', foreignKey:'userId'});
    }
  }
  Users.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false, 
      unique: true,
    },
    psw: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Users',
  });
  
  Users.addHook('beforeSave', async crypt => {
    return bcrypt.hash(crypt.psw, 8)
    .then(hash => {
      crypt.psw = hash;
    })
    .catch(err => {
      throw new Error();
    });
  });
 
  return Users;
};