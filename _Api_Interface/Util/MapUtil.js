const TypeUtil = require('./TypeUtil')

module.exports = class MapUtil extends TypeUtil {
  constructor(keyGeneric, valueGeneric) {
    super(keyGeneric)
    this.keyGeneric = keyGeneric
    this.valueGeneric = valueGeneric

    this.map = new Map()
  }

  //  Map에 key와 value를 설정
  put = (key, value) => {
    try {
      this.keyGenericCheck(key)
      this.valueGenericCheck(value)
    } catch (err) {
      console.log(err)
      return false
    }

    this.map.set(key, value)
    return true
  }

  //   해당하는 키를 삭제
  remove = (key) => {
    try {
      this.keyGenericCheck(key)
    } catch (err) {
      console.log(err)
      return false
    }

    this.map.delete(key)
    return true
  }

  // 값이 같으면 모두 삭제
  removeByValue = (value) => {
    try {
      this.valueGenericCheck(value)
    } catch (err) {
      console.log(err)
      return false
    }

    this.getKeyArray()

    return true
  }

  //   모든 요소 삭제
  clear = () => this.map.clear()

  //  MapUtil 객체를 복사해서 반환함
  clone = () => {
    const arr = this.getKeyAndValueArray()
    const map = new this.constructor(this.keyGeneric, this.valueGeneric)

    for (let i = 0; i < arr.length; i += 1) {
      map.put(arr[i][0], arr[i][1])
    }

    return map
  }

  //  map의 사이즈를 반환함
  getSize = () => this.map.size

  // 다른 MapUtil과 합침 이미 같은 키가 있다면 새로운 값은 버림
  merge = (mapUtil) => {
    try {
      this.genericCheck(mapUtil, MapUtil)
      this.keyGenericCheck(mapUtil.keyGeneric)
      this.valueGenericCheck(mapUtil.valueGeneric)
    } catch (err) {
      console.log(err)
      return false
    }

    const orderMapArr = mapUtil.getKeyAndValueArray()

    for (let i = 0; i < orderMapArr.length; i += 1) {
      if (!this.map.isContainsKey(orderMapArr[i][0])) {
        this.map.put(orderMapArr[i][0], orderMapArr[i][1])
      }
    }

    return true
  }

  // 키로 값을 찾아 반환
  getValueByKey = (key) => {
    try {
      this.keyGenericCheck(key)
    } catch (err) {
      return false
    }

    return this.map.get(key)
  }

  valueGenericCheck = (value) => this.genericCheck(value, this.valueGeneric)

  keyGenericCheck = (key) => this.genericCheck(key, this.keyGeneric)

  isKeyEnpty = (key) => {
    try {
      this.keyGenericCheck(key)
    } catch (err) {
      console.log(err)
      return false
    }

    return this.map.has(key)
  }

  //   값으로 첫번째 키를 '하나만'찾아 반환
  getKeyByValue = (value) => {
    try {
      this.valueGenericCheck(value)
    } catch (err) {
      console.log(err)
      return false
    }
    return this.getKeyArray().find((key) => this.getValueByKey(key) === value)
  }

  // 값으로 키를 모두 찾아 배열로 반환
  getKeyArrayByValue = (value) => {
    try {
      this.valueGenericCheck(value)
    } catch (err) {
      console.log(err)
      return false
    }

    const keyArr = []
    const keys = this.getKeyArray()

    for (let i = 0; i < keys.length; i += 1) {
      if (this.getValueByKey(keys[i]) === value) {
        keyArr.push(keys[i])
      }
    }

    return keyArr
  }

  //   키와 값이 쌍으로 이루어진 배열의 배열을 반환 (2차원 배열)
  getKeyAndValueArray = () => [...this.map.entries()]

  //   키와 값이 쌍으로 이루어진 객체의 배열을 반환
  getKeyAndValueObjectArray = () => {
    const entries = [...this.map.entries()]
    const entrieObjectArray = []
    for (let i = 0; i < entries.length; i += 1) {
      entrieObjectArray.push({
        key: entries[i][0],
        value: entries[i][1],
      })
    }
    return entrieObjectArray
  }

  //   키 배열 반환
  getKeyArray = () => [...this.map.keys()]

  //   값 배열 반환
  getValueArray = () => [...this.map.values()]

  // key를 파라미터로 주는 foreach
  forEachParamKey = (func) => {
    const keys = this.getKeyArray()
    for (let i = 0; i < keys.length; i += 1) {
      func(keys[i])
    }
  }

  // value를 파라미터로 주는 foreach
  forEachParamValue = (func) => {
    const values = [...this.map.values()]
    for (let i = 0; i < values.length; i += 1) {
      func(values[i])
    }
  }

  //  key와 value로 쌍을 이루는 객체를 파라미터로 주는 foreach
  forEachParamKeyAndValue = (func) => {
    const arr = this.getKeyAndValueObjectArray()
    for (let i = 0; i < arr.length; i += 1) {
      func(arr[i])
    }
  }

  // map안에 특정 key가 있는지 검색
  isContainsKey = (key) => {
    try {
      this.keyGenericCheck(key)
    } catch (err) {
      console.log(err)
      return false
    }

    return this.getKeyArray().some(key)
  }

  // map안에 특정 value가 있는지 검색
  isContainsValue = (value) => {
    try {
      this.valueGenericCheck(value)
    } catch (err) {
      console.log(err)
      return false
    }

    return this.getValueArray().some(value)
  }

  // map안에 특정 value가 몇개 있는지 검색
  containsValueCount = (value) => {
    try {
      this.valueGenericCheck(value)
    } catch (err) {
      console.log(err)
      return false
    }
    let count = 0
    const arr = this.getValueArray()

    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i] === value) {
        count += 1
      }
    }

    return count
  }
}
