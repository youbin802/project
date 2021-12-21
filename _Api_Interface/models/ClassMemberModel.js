module.exports = function member(sequelize, DataTypes) {
  const members = sequelize.define('class_members', {
    classMemberId: {
      field: 'class_member_id',
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

    classId: {
      field: 'class_id',
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

  members.associate = (models) => {
    members.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'userId',
    })

    members.belongsTo(models.Class, {
      foreignKey: 'classId',
      targetKey: 'classId',
    })
  }

  return members
}
