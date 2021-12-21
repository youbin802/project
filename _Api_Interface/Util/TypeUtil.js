const exception = require('../Exception')

const { Exception } = exception
const ErrorCode = 302

module.exports = class TypeUtil {
  // 인스턴스를 생성할때 타입을 설정해줌
  constructor(generic) {
    this.generic = generic
  }

  // 값이 같은 자료형인지 확인
  genericCheck = (value, type = this.generic) => {
    if (!(value.constructor === type)) {
      exception.addThrow(new Exception(ErrorCode, 'TypeUtil: TypeError'))
    }
    return true
  }

  // 자신의 자료형을 반환
  getGeneric = () => this.generic
}
