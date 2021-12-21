module.exports = function userFile(sequelize, DataTypes) {
  const usersFiles = sequelize.define('users_files', {
    userFileId: {
      field: 'user_file_id',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      field: 'user_id',
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },

    fileId: {
      field: 'file_id',
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },

    folderId: {
      field: 'folder_id',
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

  usersFiles.associate = (models) => {
    usersFiles.belongsTo(models.file, {
      foreignKey: 'fileId',
      targetKey: 'fileId',
    })
    usersFiles.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'userId',
    })
  }

  return usersFiles
}
