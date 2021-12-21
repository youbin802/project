const db = require('../models')
const exception = require('../Exception')
const binaryUtil = require('../Util/BinaryUtil')

const { file, classFile, Sequelize, userFile } = db
const { Op } = Sequelize
const { Exception } = exception
const ErrorCode = 202

module.exports = class {
  // 파일 하나를 리턴합니다
  async getFile(fileId) {
    try {
      return await file.findOne({
        attributes: ['fileId', 'fileName', 'fileOwner', 'status'],
        where: {
          fileId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  async isFileOwner(fileId, fileOwner) {
    try {
      return (
        (await file.findOne({
          where: {
            fileId,
            fileOwner,
            [Op.and]: Sequelize.literal('status & 64 != 64'),
          },
        })) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  // 유저파일 하나를 리턴합니다
  async getUserFile(fileId, userId) {
    try {
      return await userFile.findOne({
        where: {
          fileId,
          userId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  /* 삭제 */

  async removeFile(fileId) {
    // 공유 파일 삭제
    try {
      return (
        (await file.update(
          {
            status: Sequelize.literal('status | 64'),
          },
          {
            where: {
              fileId,
            },
          },
        )) !== null
      )
    } catch (error) {
      throw exception.addThrow(
        new Exception(ErrorCode, 'null pointer exception'),
      )
    }
  }

  async removeUserFile(userFileId, userId) {
    // 공유 파일 삭제
    try {
      return (
        (await userFile.update(
          {
            status: Sequelize.literal('status | 64'),
          },
          {
            where: {
              userFileId,
              userId,
            },
          },
        )) !== null
      )
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async removeClassFile(classFileId) {
    // 수업 파일 삭제
    try {
      return (
        (await classFile.update(
          {
            status: Sequelize.literal('status | 64'),
          },
          {
            where: {
              classFileId,
            },
          },
        )) !== null
      )
    } catch (error) {
      throw exception.addThrow(
        new Exception(ErrorCode, 'null pointer exception'),
      )
    }
  }

  /* 삽입 */

  async insertUserFile(currentFolder, fileId, userId) {
    // insertUserFile (현재폴더, 새파일)
    try {
      return (
        await userFile.create({
          folderId: currentFolder,
          fileId,
          userId,
          status: 0,
        })
      ).dataValues.userFileId
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }
    return false
  }

  async insertFile(fileId, fileName, fileOwner) {
    // files테이블에 insert 처리
    try {
      return (
        (await file.create({
          fileId,
          fileName,
          fileOwner,
          status: 0,
        })) !== fileId
      )
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async insertClassFile(
    fileId,
    classId,
    setting = { copy: true, download: true },
  ) {
    // class_files 테이블에 insert 처리
    try {
      const status = binaryUtil.booelanListToBinary([
        setting.copy,
        setting.download,
      ])

      return (
        (await classFile.create({
          fileId,
          classId,
          status,
        })) !== null
      )
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  /* 업데이트 */

  async updateFile(fileId, fileName) {
    try {
      return (
        (await file.update(
          { fileName },
          {
            where: {
              fileId,
              [Op.and]: Sequelize.literal('status & 64 != 64'),
            },
          },
        )) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async updateClassFileSetting(classFileId, setting) {
    try {
      const status = binaryUtil.booelanListToBinary([
        setting.copy,
        setting.download,
      ])

      return (
        (await classFile.update(
          {
            status,
          },
          { where: { classFileId } },
        )) !== null
      )
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async updateMoveFile(userFileId, targetFolder) {
    // 폴더이름 변경
    try {
      return (
        (await userFile.update(
          { folderId: targetFolder },
          { where: { userFileId } },
        )) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  /* 얽어오기 */

  async getUserFiles(folderId, userId) {
    let data = null
    try {
      data = await userFile.findAll({
        where: {
          parent_folder_id: folderId,
          userId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return data
  }

  async getClassFiles(classId) {
    let data = null
    try {
      data = await classFile.findAll({
        attributes: ['classFileId', 'classId', 'fileId', 'status'],
        include: [
          {
            attributes: ['fileName', 'fileOwner', 'status'],
            model: file,
            where: {
              [Op.and]: Sequelize.literal('file.status & 64 != 64'),
            },
          },
        ],
        where: {
          classId,
          [Op.and]: Sequelize.literal('class_files.status & 64 != 64'),
        },
      })
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return data
  }

  async getClassFile(classFileId) {
    let data = null
    try {
      data = await classFile.findOne({
        attributes: ['classFileId', 'classId', 'fileId', 'status'],
        include: [
          {
            attributes: ['fileName', 'fileOwner', 'status'],
            model: file,
            where: {
              [Op.and]: Sequelize.literal('file.status & 64 != 64'),
            },
          },
        ],
        where: {
          classFileId,
          [Op.and]: Sequelize.literal('class_files.status & 64 != 64'),
        },
      })
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return data
  }

  async getFilesByFolderId(folderId, userId) {
    try {
      return (
        await userFile.findAll({
          attributes: ['userFileId'],
          include: [
            {
              attributes: ['fileId', 'fileOwner', 'fileName'],
              model: file,
            },
          ],
          where: {
            folderId,
            userId,
            [Op.and]: Sequelize.literal('user_file.status & 64 != 64'),
            [Op.and]: Sequelize.literal('file.status & 64 != 64'),
          },
        })
      ).map((x) => ({
        fileId: x.dataValues.file.dataValues.fileId,
        fileName: x.dataValues.file.dataValues.fileName,
        fileOwner: x.dataValues.file.dataValues.fileOwner,
        userFileId: x.dataValues.userFileId,
      }))
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }
}
