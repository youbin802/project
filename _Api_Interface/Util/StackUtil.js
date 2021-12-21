const TypeUtil = require('./TypeUtil')

// stack을 구현한 클래스
module.exports = class StackUtil extends TypeUtil {
  // 인스턴스를 생성할때 타입을 설정해줌
  constructor(generic) {
    super(generic)
    this.stack = []
  }

  // stack에 값을 넣음
  insert = (value) => {
    try {
      this.genericCheck(value)
    } catch (err) {
      console.log(err)
      return false
    }

    this.stack.push(value)
    return true
  }

  // stack에서 값을 꺼냄
  pop = () => this.stack.pop()

  //   모든 요소 삭제
  clear = () => this.map.clear()

  // stack 객체를 복사해서 반환함
  clone = () => {
    const newstack = new StackUtil(this.generic)
    for (let i = 0; i < this.stack.getSize(); i += 1) {
      newstack.insert(this.stack[i])
    }
    return newstack
  }

  //  map의 사이즈를 반환함
  getSize = () => this.map.size

  // 다른 stack와 합침 (매개변수로 들어온 stack의 요소들이 뒤로 감)
  merge = (stack) => {
    try {
      this.genericCheck(stack, StackUtil)
      this.genericCheck(stack.getGeneric())
    } catch (err) {
      console.log(err)
      return false
    }

    for (let i = 0; i < stack.getSize(); i += 1) {
      this.stack.insert(stack.stack[i])
    }

    return true
  }
}
