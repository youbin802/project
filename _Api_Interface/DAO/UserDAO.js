const db = require('../models')
const exception = require('../Exception')

const { user, member, file, Sequelize } = db
const { Op } = Sequelize
const { Exception } = exception
const ErrorCode = 205

module.exports = class {
  // userId로 유저의 정보를 반환
  async getUser(userId) {
    try {
      return await user.findOne({
        attributes: ['userId', 'userName', 'status'],
        where: {
          userId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // 유저이름 업데이트
  async updateUserName(userId, userName) {
    try {
      return (
        (await user.findOne(
          {
            userName,
          },
          {
            where: {
              userId,
              [Op.and]: Sequelize.literal('status & 64 != 64'),
            },
          },
        )) !== undefined
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }
    return false
  }

  // 유저정보 업데이트
  async updateUser(
    userId,
    parmas = {
      userName: '',
      status: '', // 등등..
    },
  ) {
    try {
      return (
        (await user.update(parmas, {
          where: {
            userId,
            [Op.and]: Sequelize.literal('status & 64 != 64'),
          },
        })) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  // 유저 삭제
  async deleteUser(userId) {
    try {
      return (
        (await user.update(
          {
            status: Sequelize.literal('status | 64'),
          },
          {
            where: {
              userId,
            },
          },
        )) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  // 회원 가입 성공시 true 반환
  // job은 교사라면 0, 학생이라면 1
  join = async (userId, job, userName) => {
    try {
      await user.create({
        userId,
        userName,
        status: job,
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }
    return true
  }

  // userIdList를 userList로 바꿔줍니다 (Op.in, Op.notIn 설정 가능)
  userIdListToUserList = async (userIdList, type = Op.in) => {
    try {
      if (userIdList === null) {
        return []
      }

      return await user.findAll({
        where: {
          userId: {
            [type]: userIdList,
          },
        },
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  getClassMemberIdList = async (
    classId,
    where = { [Op.and]: Sequelize.literal('status & 1 = 1') },
  ) => {
    try {
      const idList = await member.findAll({
        attributes: ['userId'],
        where: {
          classId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
          ...where,
        },
      })

      if (idList === null) {
        return null
      }

      return idList.map((x) => x.dataValues.userId)
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // classId가 같은 class에서 수업을 하고 있는 교사 리스트 반환
  getClassTeacher = async (classId) => {
    try {
      return await this.userIdListToUserList(
        await this.getClassMemberIdList(classId, {
          [Op.and]: Sequelize.literal('status & 1 = 0'),
        }),
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // classId가 같은 class에서 수업을 안 하고 있는 교사 리스트 반환
  getNotClassTeacher = async (classId) => {
    try {
      return (await this.getClassStudent(classId)).filter(
        (x) => (x.dataValues.status & 1) === 0,
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // classId가 같은 class에서 수업을 듣고 있는 학생 리스트 반환
  getClassStudent = async (classId) => {
    try {
      return await this.userIdListToUserList(
        await this.getClassMemberIdList(classId, {
          [Op.and]: Sequelize.literal('status & 1 = 1'),
        }),
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // class의 구성원 리스트 반환
  getClassMembers = async (classId) => {
    try {
      return await this.userIdListToUserList(
        await this.getClassMemberIdList(classId, {}),
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // 파일의 소유자 반환, 파일이 없다면 false, 소유자가 없다면 null 반환
  getFileOwner = async (fileId) => {
    try {
      return (
        await file.findOne({
          include: [
            {
              model: user,
            },
          ],
          where: {
            fileId,
            [Op.and]: Sequelize.literal('status & 64 != 64'),
          },
        })
      ).dataValues.user
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // user가 교사인지 확인, 교사라면 false, 학생이라면 true 반환
  isStudent = async (userId) => {
    try {
      const findUser = await this.getUser(userId)

      if (findUser === null) {
        return null
      }

      return (findUser.dataValues.status & 1) === 1
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  getTeacherList = async () => {
    let result = null
    try {
      result = (
        await user.findAll({
          where: {
            status: 0,
          },
        })
      ).map((e) => e.dataValues)
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'DB 처리중 Error'))
    }

    return result
  }

  getStudentList = async () => {
    let result = null

    try {
      result = (
        await user.findAll({
          where: {
            status: 1,
          },
        })
      ).map((e) => e.dataValues)
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'DB 처리중 Error'))
    }

    return result
  }
}
