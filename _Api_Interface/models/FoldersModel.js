module.exports = function folder(sequelize, DataTypes) {
  const folders = sequelize.define('folders', {
    folderId: {
      field: 'folder_id',
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
    },

    folderName: {
      field: 'folder_name',
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },

    userId: {
      field: 'user_id',
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },

    parentFolderId: {
      field: 'parent_folder_id',
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

  return folders
}
