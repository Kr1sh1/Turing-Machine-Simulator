import { renderHook } from "@testing-library/react"
import useTape from "../../hooks/useTape"
import { emptyCellCharacter } from "../../Constants"

function nameResults(tape) {
  return {
    getCenteredSlice: tape[0],
    readCell: tape[1],
    writeCell: tape[2],
    setTape: tape[3],
    getTape: tape[4],
  }
}

function setupTape(...args) {
  const { result } = renderHook(() => useTape(...args))
  return nameResults(result.current)
}

describe("initialisation", () => {
  test("initial value is set", () => {
    const initialValue = "Initial"
    const tape = setupTape(true, initialValue)
    expect(tape.getTape().forwardTape).toEqual([...initialValue])
  })

  test("backwardTape is null for one-way infinite tape", () => {
    const tape = setupTape(true, "")
    expect(tape.getTape().backwardTape).toBeNull()
  })

  test("backwardTape is an empty array for two-way tape", () => {
    const tape = setupTape(false, "")
    expect(tape.getTape().backwardTape).toEqual([])
  })
})

test("cannot read negative index on one-way infinite tape", () => {
  const tape = setupTape(true, "")
  expect(() => tape.readCell(-1)).toThrowError("Invalid Read: Negative indices are invalid for one-way infinite tape")
})

test("can read negative index on two-way infinite tape", () => {
  const tape = setupTape(false, "")
  expect(tape.readCell(-1)).toBe(emptyCellCharacter)
})

test("cannot write to negative index on one-way infinite tape", () => {
  const tape = setupTape(true, "")
  expect(() => tape.writeCell(-1)).toThrowError("Invalid Write: Negative indices are invalid for one-way infinite tape")
})

test("can write to negative index on two-way infinite tape", () => {
  const tape = setupTape(false, "")
  expect(() => tape.writeCell(-1, "x")).not.toThrow()
})

test("can read positive index on one-way infinite tape", () => {
  const tape = setupTape(true, "")
  expect(tape.readCell(0)).toBe(emptyCellCharacter)
})

test("can read positive index on two-way infinite tape", () => {
  const tape = setupTape(false, "")
  expect(tape.readCell(0)).toBe(emptyCellCharacter)
})

test("can write positive index on one-way infinite tape", () => {
  const tape = setupTape(true, "")
  expect(() => tape.writeCell(0, "x")).not.toThrow()
})

test("can write positive index on two-way infinite tape", () => {
  const tape = setupTape(false, "")
  expect(() => tape.writeCell(0, "x")).not.toThrow()
})

test("centered slice with one-way infinite tape", () => {
  const tape = setupTape(true, "initial")
  expect(tape.getCenteredSlice(1, 0).map(obj => obj.value)).toEqual([..."i"])
  expect(tape.getCenteredSlice(3, 0).map(obj => obj.value)).toEqual([..."in"])
  expect(tape.getCenteredSlice(5, 0).map(obj => obj.value)).toEqual([..."ini"])
  expect(tape.getCenteredSlice(1, 1).map(obj => obj.value)).toEqual([..."n"])
  expect(tape.getCenteredSlice(3, 2).map(obj => obj.value)).toEqual([..."nit"])
  expect(tape.getCenteredSlice(5, 5).map(obj => obj.value)).toEqual([..."tial", emptyCellCharacter])
})

test("centered slice with two-way infinite tape", () => {
  const tape = setupTape(false, "initial")
  expect(tape.getCenteredSlice(1, 0).map(obj => obj.value)).toEqual([..."i"])
  expect(tape.getCenteredSlice(3, 0).map(obj => obj.value)).toEqual([emptyCellCharacter, ..."in"])
  expect(tape.getCenteredSlice(5, 0).map(obj => obj.value)).toEqual([emptyCellCharacter, emptyCellCharacter, ..."ini"])
})

test("setting tape works for one-way infinite tape", () => {
  const tape = setupTape(true, "")
  tape.setTape({
    forwardTape: [..."initial"],
    backwardTape: [..."no"]
  })
  expect(tape.getTape()).toEqual({
    forwardTape: [..."initial"],
    backwardTape: null
  })
})

test("setting tape works for two-way infinite tape", () => {
  const tape = setupTape(false, "")
  tape.setTape({
    forwardTape: [..."initial"],
    backwardTape: [..."yes"]
  })
  expect(tape.getTape()).toEqual({
    forwardTape: [..."initial"],
    backwardTape: [..."yes"]
  })
})

test("getting tape works for one-way infinite tape", () => {
  const tape = setupTape(true, "initial")
  expect(tape.getTape()).toEqual({
    forwardTape: [..."initial"],
    backwardTape: null
  })
})

test("getting tape works for two-way infinite tape", () => {
  const tape = setupTape(false, "initial")
  expect(tape.getTape()).toEqual({
    forwardTape: [..."initial"],
    backwardTape: []
  })
})
