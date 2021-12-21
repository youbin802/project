const db = require('../models')
const exception = require('../Exception')

const { Class, Sequelize, member } = db
const { Op } = Sequelize
const { Exception } = exception
const ErrorCode = 201

module.exports = class {
  async getClass(classId = '') {
    try {
      return await Class.findOne({
        where: {
          classId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }
    return null
  }

  async getClasses() {
    try {
      return await Class.findAll({}, Sequelize.literal('status & 64 != 64'))
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }
    return null
  }

  async getUserClass(userId) {
    try {
      return (
        await member.findAll({
          include: [
            {
              model: Class,
              where: {
                [Op.and]: Sequelize.literal('class.status & 64 != 64'),
              },
            },
          ],
          where: {
            userId,
            [Op.and]: Sequelize.literal('class_members.status & 64 != 64'),
          },
        })
      ).map((x) => x.dataValues.class)
    } catch (err) {
      console.log(err)
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }
    return null
  }

  async searchClass(keyword) {
    try {
      return await Class.findAll({
        where: {
          className: {
            [Op.like]: `%${keyword}%`,
          },
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (err) {
      throw exception.addThrow(
        new Exception(ErrorCode, 'null pointer exception'),
      )
    }
  }

  // 수업 추가함수, className : 교과명
  // 성공했다면 true 반환
  createClass = async (className, userId) => {
    try {
      const { classId } = (
        await Class.create({
          className,
          status: 0,
        })
      ).dataValues

      await member.create({
        classId,
        userId,
        status: 2,
      })

      return classId
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'type error'))
    }

    return false
  }

  toggleMemberJob = async (classId, userId) => {
    try {
      return (
        (await member.update(
          {
            status: Sequelize.literal(`status XOR 1`),
          },
          {
            where: {
              classId,
              userId,
              [Op.and]: Sequelize.literal('status & 64 != 64'),
            },
          },
        )) != null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  updateClass = async (classId, className) => {
    try {
      return (
        (await Class.update(
          {
            className,
          },
          {
            where: {
              classId,
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

  // 내 수업 삭제 함수
  deleteMyClass = async (classId, userId) => {
    try {
      return (
        (await member.update(
          {
            status: Sequelize.literal('status | 64'),
          },
          {
            where: {
              classId,
              userId,
              [Op.and]: Sequelize.literal('status & 64 != 64'),
            },
          },
        )) != null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async getMyClassOne(classId, userId) {
    try {
      return await member.findOne({
        where: {
          classId,
          userId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // 내 수업 추가함수
  async addMyClass(classId, userId) {
    try {
      return (
        member.create({
          classId,
          userId,
          status: 1,
        }) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  // 수업 삭제함수
  async deleteClass(classId) {
    try {
      await Class.update(
        {
          status: Sequelize.literal('status | 64'),
        },
        {
          where: {
            classId,
          },
        },
      )

      await member.update(
        {
          status: Sequelize.literal('status | 64'),
        },
        {
          where: {
            classId,
          },
        },
      )

      return true
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  // ClassTeacher에 컬럼을 추가하는 함수
  async createTeacher(classId, teacher) {
    try {
      teacher.forEach(async (t) => {
        await member.create({
          userId: t,
          classId,
          status: 0,
        })
      })

      return true
    } catch {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  // 관리자라면 2, 교사라면 0, 학생이라면 1을 반환, 해당 클래스에 유저가 없다면 null을 반환
  async getUserJob(classId, userId) {
    try {
      console.log(userId)

      const status = await member.findOne({
        attributes: ['status'],
        where: {
          classId,
          userId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })

      if (!status) {
        return null
      }

      return status.dataValues.status & 3
    } catch (err) {
      console.log(err)
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }
}
