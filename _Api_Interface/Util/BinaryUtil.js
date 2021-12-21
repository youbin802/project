module.exports = new (class {
  // boolean list를 받아서 boolean 값을 1비트에 하나씩 순서대로 저장 후 반환합니다
  booelanListToBinary(booleanList) {
    let binary = 0b0
    for (let i = 0; i < booleanList.length; i += 1) {
      binary += booleanList[i] ? 1 << i : 0
    }

    return binary
  }

  // binary를 boolean length크기 list로 반환합니다
  binaryToBooleanList(binary, length) {
    const booleanList = []
    for (let i = 0; i < length; i += 1) {
      booleanList.push((binary & (1 << i)) === 1 << i)
    }
    return booleanList
  }
})()
