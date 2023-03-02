class Tape {
  constructor() {
    this.tape = new Array(30)
  }

  writeCell(index, value) {
    if ()
    this.tape[index + offset] = value
  }
}

class OneWayInfiniteTape extends Tape {
  constructor() {
    super()
  }
}

class TwoWayInfiniteTape extends Tape {
  constructor() {
    super()
    this.offset = 0
  }

  readCell(index) {
    return this.tape[index + this.offset]
  }
}