module.exports = function file(sequelize, DataTypes) {
  const files = sequelize.define('files', {
    fileId: {
      field: 'file_id',
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
    },

    fileName: {
      field: 'file_name',
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },

    fileOwner: {
      field: 'file_owner',
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
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

  files.associate = (models) => {
    files.belongsTo(models.user, {
      foreignKey: 'fileOwner',
      targetKey: 'userId',
    })
  }

  return files
}
