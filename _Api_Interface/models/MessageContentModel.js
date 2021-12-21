module.exports = function messageContent(sequelize, DataTypes) {
  const MessageContent = sequelize.define('message_contents', {
    contentId: {
      field: 'content_id',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    writeAt: {
      field: 'write_at',
      type: DataTypes.DATE,
      unique: false,
      allowNull: false,
    },

    content: {
      field: 'content',
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

  return MessageContent
}
