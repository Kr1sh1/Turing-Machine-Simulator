class Tape {
  constructor(initialValue) {
    this.forwardTape = [...initialValue]
  }
}

export class OneWayInfiniteTape extends Tape {
  getCenteredSlice(numberOfElements, headPosition) {
    const numberOfElementsOnRightSide = Math.floor(numberOfElements / 2)
    const numberOfElementsOnLeftSide = Math.min(numberOfElementsOnRightSide, headPosition)
    const slice = []

    for (let index = numberOfElementsOnLeftSide; index > 0; index--) {
      slice.push({ value: this.readCell(headPosition - index), key: headPosition - index})
    }
    for (let index = 0; index < numberOfElementsOnRightSide + 1; index++) {
      slice.push({ value: this.readCell(index + headPosition), key: index + headPosition})
    }
    return slice
  }

  writeCell(index, value) {
    if (index === this.forwardTape.length) {
      this.forwardTape.push(value)
      return
    } else if (index > this.forwardTape.length) {
      throw new Error("Invalid write index. Must write linearly")
    }
    if (index < 0) {
      throw new Error("Negative indices are invalid for one-way infinite tape")
    }
    this.forwardTape[index] = value
  }

  readCell(index) {
    if (index < 0) {
      throw new Error("Negative indices are invalid for one-way infinite tape")
    }
    if (index >= this.forwardTape.length) {
      return ""
    }
    return this.forwardTape[index]
  }
}

export class TwoWayInfiniteTape extends Tape {
  constructor(initialValue) {
    super(initialValue)
    this.backwardTape = []
  }

  getCenteredSlice(numberOfElements, headPosition) {
    const numberOfElementsOnSide = Math.floor(numberOfElements / 2)
    const slice = []

    for (let index = headPosition - numberOfElementsOnSide; index < numberOfElementsOnSide + headPosition + 1; index++) {
      slice.push({ value: this.readCell(index), key: index })
    }
    return slice
  }

  writeCell(index, value) {
    if (index < 0) {
      if (-(index + 1) > this.backwardTape.length) {
        throw new Error("Invalid write index. Must write linearly")
      }
      if (-(index + 1) === this.backwardTape.length) {
        this.backwardTape.push(value)
        return
      }
    }
    if (index > this.forwardTape.length) {
      throw new Error("Invalid write index. Must write linearly")
    }
    if (index === this.forwardTape.length) {
      this.forwardTape.push(value)
      return
    }
    this.forwardTape[index] = value
  }

  readCell(index) {
    if (index < 0) {
      if (-(index + 1) >= this.backwardTape.length) {
        return ""
      }
      return this.backwardTape[-(index + 1)]
    }
    if (index >= this.forwardTape.length) {
      return ""
    }
    return this.forwardTape[index]
  }
}