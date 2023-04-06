import { renderHook } from "@testing-library/react"
import useTuringMachine from "../../hooks/useTuringMachine"
import { MoveDirection, StateType } from "../../Enums"
import { leftEndMarker } from "../../Constants"
import { incrementBinaryOneWay } from "../../ExampleMachines"

function nameResults(tm) {
  return {
    getCenteredSlice: tm[0],
    getConfiguration: tm[1],
    performTransition: tm[2],
    getTransitions: tm[3],
    reset: tm[4],
  }
}

function setupTuringMachine(...args) {
  const { result } = renderHook(() => useTuringMachine(...args))
  return nameResults(result.current)
}

const selections = {
  [StateType.INITIAL]: "S0",
  [StateType.HALT]: "",
  [StateType.ACCEPT]: "",
  [StateType.REJECT]: "",
}

const transitions = []

describe("test initial configuration is set", () => {
  test("initial state is set", () => {
    const tm =  setupTuringMachine(selections, transitions, true)
    expect(tm.getConfiguration().state).toBe("S0")
  })

  test("initial head position is 0 for two-way infinite tape", () => {
    const tm =  setupTuringMachine(selections, transitions, false)
    expect(tm.getConfiguration().headPosition).toBe(0)
  })

  test("initial head position is 1 for one-way infinite tape", () => {
    const tm =  setupTuringMachine(selections, transitions, true)
    expect(tm.getConfiguration().headPosition).toBe(1)
  })

  test("left-end marker is set at position 0 for one-way infinite tape", () => {
    const tm =  setupTuringMachine(selections, transitions, true)
    expect(tm.getConfiguration().tape.forwardTape[0]).toBe(leftEndMarker)
  })

  test("left-end marker is not set at position 0 for two-way infinite tape", () => {
    const tm =  setupTuringMachine(selections, transitions, false)
    expect(tm.getConfiguration().tape.forwardTape[0]).not.toBe(leftEndMarker)
  })
})

describe("test getTransitions", () => {
  test("getTransitions returns initial transitions", () => {
    const tm =  setupTuringMachine(incrementBinaryOneWay.defaultSelections, incrementBinaryOneWay.defaultTransitions, true)
    expect(tm.getTransitions()).toHaveLength(1)
    expect(tm.getTransitions()[0].id).toBe(2)

    tm.reset("1")
    expect(tm.getTransitions()).toHaveLength(1)
    expect(tm.getTransitions()[0].id).toBe(0)

    tm.reset("0001")
    expect(tm.getTransitions()).toHaveLength(1)
    expect(tm.getTransitions()[0].id).toBe(1)
  })

  test("getTransitions returns correct transitions after a transition is performed", () => {
    const tm =  setupTuringMachine(incrementBinaryOneWay.defaultSelections, incrementBinaryOneWay.defaultTransitions, true)
    tm.performTransition(2)
    expect(tm.getTransitions()).toHaveLength(1)
    expect(tm.getTransitions()[0].id).toBe(5)

    tm.reset("1")
    tm.performTransition(0)
    expect(tm.getTransitions()).toHaveLength(1)
    expect(tm.getTransitions()[0].id).toBe(2)

    tm.reset("0001")
    tm.performTransition(1)
    expect(tm.getTransitions()).toHaveLength(1)
    expect(tm.getTransitions()[0].id).toBe(1)
  })

  test("get Transitions returns no transitions when in halt state", () => {
    const tm =  setupTuringMachine(incrementBinaryOneWay.defaultSelections, incrementBinaryOneWay.defaultTransitions, true)
    tm.reset("0")
    tm.performTransition(1)
    tm.performTransition(2)
    tm.performTransition(3)
    expect(tm.getTransitions()).toHaveLength(0)
  })
})

describe("test performTransition", () => {
  test("", () => {})

  test("", () => {})

  test("", () => {})
})

describe("test left-end marker", () => {
  test("left-end marker is not over-writable at position 0 in one-way infinite tape", () => {
    const transitions = [
      ...incrementBinaryOneWay.defaultTransitions,
      {
        id: 9,
        state: "S1",
        read: leftEndMarker,
        write: "x",
        move: MoveDirection.STAY,
        nextState: "Halt"
      }
    ]
    const tm =  setupTuringMachine(incrementBinaryOneWay.defaultSelections, transitions, true)
    tm.performTransition(2)
    tm.performTransition(9)
    expect(tm.getConfiguration().tape.forwardTape[0]).toBe(leftEndMarker)
  })
})

describe("test reset", () => {
  test("reset changes to last initial value when no argument specified", () => {
    const tm =  setupTuringMachine(selections, transitions, true)
    tm.reset()
    expect(tm.getConfiguration().tape.forwardTape).toEqual([leftEndMarker])

    tm.reset("new initial")
    tm.reset()
    expect(tm.getConfiguration().tape.forwardTape).toEqual([leftEndMarker, ..."new initial"])
  })

  test("reset changes initial value to new one", () => {
    const tm =  setupTuringMachine(selections, transitions, true)
    tm.reset("new initial")
    expect(tm.getConfiguration().tape.forwardTape).toEqual([leftEndMarker, ..."new initial"])
  })
})
