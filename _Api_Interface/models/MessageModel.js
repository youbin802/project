module.exports = function message(sequelize, DataTypes) {
  const Message = sequelize.define('messages', {
    messageId: {
      field: 'message_id',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    sendUserId: {
      field: 'send_user_id',
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },

    receiveUserId: {
      field: 'receive_user_id',
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

    replyMessageId: {
      field: 'reply_message_id',
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },

    contentId: {
      field: 'content_id',
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

  Message.associate = (models) => {
    Message.belongsTo(models.messageContent, {
      foreignKey: 'contentId',
      targetKey: 'contentId',
    })

    Message.belongsTo(models.user, {
      foreignKey: 'receiveUserId',
      targetKey: 'userId',
    })

    Message.belongsTo(models.user, {
      foreignKey: 'sendUserId',
      targetKey: 'userId',
    })

    Message.belongsTo(models.Class, {
      foreignKey: 'classId',
      targetKey: 'classId',
    })
  }

  return Message
}
