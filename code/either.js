class Left {
  constructor(value) {
    this._value = value
  }

  static of (value) {
    return new Left(value)
  }

  map (fn) {
    return this
  }
}

class Right {
  constructor(value) {
    this._value = value
  }

  static of (value) {
    return new Right(value)
  }

  map (fn) {
    return Right.of(fn(this._value))
  }
}

const parseJson = str => {
  try {
    return Right.of(JSON.parse(str))
  } catch (e) {
    return Left.of(e.message)
  }
}

console.log(parseJson('{"name": "lcc"}'))