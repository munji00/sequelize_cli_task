'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userAddress.belongsTo(models.User, {
        foreignKey:"user_id"
      })
    }
  }
  userAddress.init({
    user_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    pinCode: DataTypes.STRING,
    mobileNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userAddress',
  });
  return userAddress;
};