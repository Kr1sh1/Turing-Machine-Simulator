import { useCallback, useRef } from "react";
import { emptyCellCharacter, leftEndMarker } from "../Constants";

export default function useTape(oneWayInfiniteTape) {
  const forwardTape = useRef(oneWayInfiniteTape ? [leftEndMarker] : [])
  const backwardTape = useRef(oneWayInfiniteTape ? null : [])

  const oneWayTapeReadCell = useCallback((readIndex) => {
    if (readIndex < 0) throw new Error("Invalid Read: Negative indices are invalid for one-way infinite tape")
    if (readIndex >= forwardTape.current.length) return emptyCellCharacter
    return forwardTape.current[readIndex]
  }, [])

  const twoWayTapeReadCell = useCallback((readIndex) => {
    if (readIndex < 0) {
      if (-(readIndex + 1) >= backwardTape.current.length) return emptyCellCharacter
      return backwardTape.current[-(readIndex + 1)]
    }

    return oneWayTapeReadCell(readIndex)
  }, [oneWayTapeReadCell])

  const readCell = useCallback((readIndex) => {
    if (oneWayInfiniteTape) {
      return oneWayTapeReadCell(readIndex)
    } else {
      return twoWayTapeReadCell(readIndex)
    }
  }, [oneWayTapeReadCell, twoWayTapeReadCell, oneWayInfiniteTape])

  const oneWayTapeWriteCell = useCallback((writeIndex, value) => {
    if (writeIndex < 0) throw new Error("Invalid Write: Negative indices are invalid for one-way infinite tape")
    if (writeIndex > forwardTape.current.length) throw new Error("Invalid Write: Must write linearly")
    if (writeIndex === 0) return

    if (writeIndex === forwardTape.current.length) forwardTape.current.push(value)
    else forwardTape.current[writeIndex] = value
  }, [])

  const twoWayTapeWriteCell = useCallback((writeIndex, value) => {
    if (writeIndex < 0) {
      if (-(writeIndex + 1) > backwardTape.current.length) throw new Error("Invalid Write: Must write linearly")

      if (-(writeIndex + 1) === backwardTape.current.length) backwardTape.current.push(value)
      else backwardTape.current[-(writeIndex + 1)] = value
      return
    }

    oneWayTapeWriteCell(writeIndex, value)
  }, [oneWayTapeWriteCell])

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
    forwardTape.current = tape.forwardTape
    backwardTape.current = tape.backwardTape
  }, [])

  const getTape = useCallback(() => {
    return {
      forwardTape: forwardTape.current,
      backwardTape: backwardTape.current
    }
  }, [])

  return [
    getCenteredSlice,
    readCell,
    writeCell,
    setTape,
    getTape
  ]
}
