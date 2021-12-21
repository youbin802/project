const db = require('../models')
const exception = require('../Exception')
const FileDAO = require('./FileDAO')

const { userFile, file, folder, Sequelize } = db
const { Op } = Sequelize
const { Exception } = exception
const ErrorCode = 203

const fileDao = new FileDAO()

module.exports = class {
  async scanFolder(parentFolderId, folderName) {
    try {
      const folders = await folder.findAll({
        where: {
          parentFolderId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })

      if (!folders) {
        return true
      }

      return folders.every((x) => x.dataValues.folderName !== folderName)
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async getFolder(folderId = '') {
    try {
      return await folder.findOne({
        where: {
          folderId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  async getFolderChildFile(parentFolderId, userId) {
    try {
      return (
        await folder.findAll({
          attributes: ['folderId', 'folderName'],
          where: {
            parentFolderId,
            userId,
            [Op.and]: Sequelize.literal('status & 64 != 64'),
          },
        })
      ).map((x) => ({
        folderId: x.dataValues.folderId,
        folderName: x.dataValues.folderName,
      }))
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }
    return null
  }

  async getFolders(parentFolderId, userId) {
    try {
      return await folder.findAll({
        where: {
          parentFolderId,
          userId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  async updateFolderName(folderId, folderName) {
    // 폴더이름 변경
    try {
      return (
        (await folder.update({ folderName }, { where: { folderId } })) !== null
      )
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async updateMoveFolder(folderId, targetFoder) {
    // 폴더 위치 변경
    try {
      return (
        (await folder.update(
          { parentFolderId: targetFoder },
          { where: { folderId } },
        )) !== null
      )
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async insertFolder(
    parentFolderId,
    folderObj = {
      userId: '', // 폴더 주인
      folderName: '', // 이름
      folderId: '', // 키
    },
  ) {
    // insertFolder (현재폴더, 새폴더)
    try {
      return (
        (await folder.create({
          parentFolderId,
          ...folderObj,
          status: 0,
        })) !== null
      )
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }
    return null
  }

  async isEmpty(folderId) {
    try {
      return (
        (await folder.findOne({
          where: {
            folderId,
            [Op.and]: Sequelize.literal('status & 64 != 64'),
          },
        })) !== null &&
        (await userFile.findOne({
          where: {
            folderId,
            [Op.and]: Sequelize.literal('status & 64 != 64'),
          },
        })) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async removeFolder(folderId) {
    // 폴더 삭제 -> 하위 파일및 폴더가 있을경우 삭제 x
    try {
      return (
        (await folder.update(
          {
            status: Sequelize.literal('status | 64'),
          },
          {
            where: {
              folderId,
            },
          },
        )) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  // 폴더째로 업로드 할 경우 쓰는 함수
  // data 입력 방식
  //   data = [{
  //     type: 'dir',
  //     name: 'name',
  //     id: 'id',
  //     data: [
  //       {
  //         type: 'dir',
  //         name: 'name',
  //         id: 'id',
  //         data: [],
  //       },
  //       {
  //         type: 'file',
  //         name: 'name',
  //         id: 'id',
  //         setting : { copy: false, download: true }
  //       },
  //     ],
  //   }]
  uploadFolder = async (parentFolderId = '', userId = '', data = []) => {
    try {
      for (let i = 0; i < data.length; i += 1) {
        const { type, name, id } = data[i]
        if (type === 'dir') {
          // eslint-disable-next-line no-await-in-loop
          await this.insertFolder(parentFolderId, {
            userId,
            folderName: name,
            folderId: id,
          })

          this.uploadFolder(id, userId, data[i].data)
        } else {
          const { setting } = data[i]
          // eslint-disable-next-line no-await-in-loop
          await fileDao.insertFile(id, name, userId, setting)
          fileDao.insertUserFile(parentFolderId, id, userId)
        }
      }

      return true
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async isFolderOwner(folderId, userId) {
    try {
      const userFolder = await folder.findOne({
        where: {
          folderId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })

      if (!userFolder) {
        return false
      }

      return userFolder.dataValues.userId === userId
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }
}
