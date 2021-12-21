module.exports = function classFile(sequelize, DataTypes) {
  const classFiles = sequelize.define('class_files', {
    classFileId: {
      field: 'class_file_id',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    classId: {
      field: 'class_id',
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },

    fileId: {
      field: 'file_id',
      type: DataTypes.INTEGER,
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

  classFiles.associate = (models) => {
    classFiles.belongsTo(models.Class, {
      foreignKey: 'classId',
      targetKey: 'classId',
    })

    classFiles.belongsTo(models.file, {
      foreignKey: 'fileId',
      targetKey: 'fileId',
    })
  }

  return classFiles
}
