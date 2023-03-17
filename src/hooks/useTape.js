import { useCallback, useState } from "react";

export default function useTape(oneWayInfiniteTape) {
  const [forwardTape, setForwardTape] = useState([])
  const [backwardTape, setBackwardTape] = useState(oneWayInfiniteTape ? null : [])

  const oneWayTapeReadCell = useCallback((readIndex) => {
    if (readIndex < 0) throw new Error("Invalid Read: Negative indices are invalid for one-way infinite tape")
    if (readIndex >= forwardTape.length) return ""
    return forwardTape[readIndex]
  }, [forwardTape])

  const twoWayTapeReadCell = useCallback((readIndex) => {
    if (readIndex < 0) {
      if (-(readIndex + 1) >= backwardTape.length) return ""
      return backwardTape[-(readIndex + 1)]
    }
    if (readIndex >= forwardTape.length) return ""
    return forwardTape[readIndex]
  }, [forwardTape, backwardTape])

  const readCell = useCallback((readIndex) => {
    if (oneWayInfiniteTape) {
      return oneWayTapeReadCell(readIndex)
    } else {
      return twoWayTapeReadCell(readIndex)
    }
  }, [oneWayTapeReadCell, twoWayTapeReadCell, oneWayInfiniteTape])

  const oneWayTapeWriteCell = useCallback((writeIndex, value) => {
    if (writeIndex === forwardTape.length) {
      setForwardTape(tape => [...tape, value])
      return
    }
    else if (writeIndex > forwardTape.length) throw new Error("Invalid Write: Must write linearly")
    if (writeIndex < 0) throw new Error("Invalid Write: Negative indices are invalid for one-way infinite tape")
    setForwardTape(tape =>
      tape.map((oldValue, index) => {
        if (index === writeIndex) return value
        return oldValue
      })
    )
  }, [forwardTape])

  const twoWayTapeWriteCell = useCallback((writeIndex, value) => {
    if (writeIndex < 0) {
      if (-(writeIndex + 1) === backwardTape.length) {
        setBackwardTape(tape => [...tape, value])
        return
      }
      if (-(writeIndex + 1) > backwardTape.length) throw new Error("Invalid write index. Must write linearly")
    }
    if (writeIndex > forwardTape.length) throw new Error("Invalid write index. Must write linearly")
    if (writeIndex === forwardTape.length) {
      setForwardTape(tape => [...tape, value])
      return
    }
    setForwardTape(tape =>
      tape.map((oldValue, index) =>{
        if (index === writeIndex) return value
        return oldValue
      })
    )
  }, [backwardTape, forwardTape])

  const writeCell = useCallback((index, value) => {
    if (oneWayInfiniteTape) {
      oneWayTapeWriteCell(index, value)
    } else {
      twoWayTapeWriteCell(index, value)
    }
  }, [oneWayTapeWriteCell, twoWayTapeWriteCell, oneWayInfiniteTape])

  const oneWayTapeCenterSlice = useCallback((numberOfElements, headPosition) => {
    const numberOfElementsOnRightSide = Math.floor(numberOfElements / 2)
    const numberOfElementsOnLeftSide = Math.min(numberOfElementsOnRightSide, headPosition)
    const slice = []

    for (let index = numberOfElementsOnLeftSide; index > 0; index--) {
      slice.push({ value: readCell(headPosition - index), key: headPosition - index})
    }
    for (let index = 0; index < numberOfElementsOnRightSide + 1; index++) {
      slice.push({ value: readCell(index + headPosition), key: index + headPosition})
    }
    return slice
  }, [readCell])

  const twoWayTapeCenterSlice = useCallback((numberOfElements, headPosition) => {
    const numberOfElementsOnSide = Math.floor(numberOfElements / 2)
    const slice = []

    for (let index = headPosition - numberOfElementsOnSide; index < numberOfElementsOnSide + headPosition + 1; index++) {
      slice.push({ value: readCell(index), key: index })
    }
    return slice
  }, [readCell])

  const getCenteredSlice = useCallback((numberOfElements, headPosition) => {
    if (oneWayInfiniteTape) {
      return oneWayTapeCenterSlice(numberOfElements, headPosition)
    } else {
      return twoWayTapeCenterSlice(numberOfElements, headPosition)
    }
  }, [oneWayTapeCenterSlice, twoWayTapeCenterSlice, oneWayInfiniteTape])

  const setTape = useCallback((tape) => {
    setForwardTape(tape.forwardTape)
    setBackwardTape(tape.backwardTape)
  }, [])

  const getTape = useCallback(() => {
    return {
      forwardTape,
      backwardTape
    }
  }, [forwardTape, backwardTape])

  return [
    getCenteredSlice,
    readCell,
    writeCell,
    setTape,
    getTape
  ]
}
