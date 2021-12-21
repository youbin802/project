module.exports = function user(sequelize, DataTypes) {
  const users = sequelize.define('users', {
    userId: {
      field: 'user_id',
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
    },

    userName: {
      field: 'user_name',
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },

    status: {
      field: 'status',
      type: DataTypes.TINYINT,
      unique: false,
      allowNull: false,
    },

    reserved1: {
      field: 'reserved1',
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },

    reserved2: {
      field: 'reserved2',
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },

    reserved3: {
      field: 'reserved3',
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
  })

  return users
}
