const TypeUtil = require('./TypeUtil')

// queue를 구현한 클래스
module.exports = class QueueUtil extends TypeUtil {
  // 인스턴스를 생성할때 타입을 설정해줌
  constructor(generic) {
    super(generic)
    this.queue = []
  }

  // queue에 값을 넣음
  insert = (value) => {
    try {
      this.genericCheck(value)
    } catch (err) {
      console.log(err)
      return false
    }

    this.queue.push(value)
    return true
  }

  // queue에서 값을 꺼냄
  poll = () => this.queue.shift()

  // 모든 요소 삭제
  clear = () => this.queue.clear()

  // queue 객체를 복사해서 반환함
  clone = () => {
    const newQueue = new QueueUtil(this.generic)
    for (let i = 0; i < this.queue.getSize(); i += 1) {
      newQueue.insert(this.queue[i])
    }
    return newQueue
  }

  //  queue의 사이즈를 반환함
  getSize = () => this.queue.length

  // 다른 queue와 합침 (매개변수로 들어온 queue의 요소들이 뒤로 감)
  merge = (queue) => {
    try {
      this.genericCheck(queue, QueueUtil)
      this.genericCheck(queue.getGeneric())
    } catch (err) {
      console.log(err)
      return false
    }

    for (let i = 0; i < queue.getSize(); i += 1) {
      this.queue.insert(queue.queue[i])
    }

    return true
  }
}
