import { emptyCellCharacter, leftEndMarker } from "./Constants"
import { MoveDirection, StateType } from "./Enums"

function makeMachine(transitions, selections, oneWayInfiniteTape, haltingState) {
  return Object.freeze({
    defaultTransitions: transitions,
    defaultSelections: selections,
    defaultOneWayInfiniteTape: oneWayInfiniteTape,
    defaultHaltingState: haltingState,
  })
}

function makeTransition(id, state, read, write, move, nextState) {
  return {
    id, state, read, write, move, nextState
  }
}

const incrementBinaryTwoWay = makeMachine(
  [
    makeTransition(0, "S0", "1", "1", MoveDirection.RIGHT, "S0"),
    makeTransition(1, "S0", "0", "0", MoveDirection.RIGHT, "S0"),
    makeTransition(2, "S0", emptyCellCharacter, emptyCellCharacter, MoveDirection.LEFT, "S1"),
    makeTransition(3, "S1", "0", "1", MoveDirection.LEFT, "Halt"),
    makeTransition(4, "S1", "1", "0", MoveDirection.LEFT, "S1"),
    makeTransition(5, "S1", emptyCellCharacter, "1", MoveDirection.LEFT, "Halt"),
  ],
  {
    [StateType.INITIAL]: "S0",
    [StateType.HALT]: "Halt",
    [StateType.ACCEPT]: "",
    [StateType.REJECT]: "",
  },
  false,
  true,
)

const incrementBinaryOneWay = makeMachine(
  [
    makeTransition(0, "S0", "1", "1", MoveDirection.RIGHT, "S0"),
    makeTransition(1, "S0", "0", "0", MoveDirection.RIGHT, "S0"),
    makeTransition(2, "S0", emptyCellCharacter, emptyCellCharacter, MoveDirection.LEFT, "S1"),
    makeTransition(3, "S1", "0", "1", MoveDirection.STAY, "Halt"),
    makeTransition(4, "S1", "1", "0", MoveDirection.LEFT, "S1"),
    makeTransition(5, "S1", leftEndMarker, leftEndMarker, MoveDirection.RIGHT, "S2"),
    makeTransition(6, "S2", "0", "1", MoveDirection.RIGHT, "S3"),
    makeTransition(7, "S3", "0", "0", MoveDirection.RIGHT, "S3"),
    makeTransition(8, "S3", emptyCellCharacter, "0", MoveDirection.STAY, "Halt"),
  ],
  {
    [StateType.INITIAL]: "S0",
    [StateType.HALT]: "Halt",
    [StateType.ACCEPT]: "",
    [StateType.REJECT]: "",
  },
  true,
  true,
)

const binaryDivisibleBy3 = makeMachine(
  [
    makeTransition(0, "S0", "1", "1", MoveDirection.RIGHT, "S1"),
    makeTransition(1, "S0", "0", "0", MoveDirection.RIGHT, "S0"),
    makeTransition(2, "S0", emptyCellCharacter, emptyCellCharacter, MoveDirection.RIGHT, "Accept"),
    makeTransition(3, "S1", "0", "0", MoveDirection.RIGHT, "S2"),
    makeTransition(4, "S1", "1", "1", MoveDirection.RIGHT, "S0"),
    makeTransition(5, "S2", "0", "0", MoveDirection.RIGHT, "S1"),
    makeTransition(6, "S2", "1", "1", MoveDirection.RIGHT, "S2"),
  ],
  {
    [StateType.INITIAL]: "S0",
    [StateType.HALT]: "",
    [StateType.ACCEPT]: "Accept",
    [StateType.REJECT]: "",
  },
  true,
  false,
)

export const oneWayTapeExamples = [
  {
    machine: binaryDivisibleBy3,
    description: "Accept if a binary number is divisible by 3"
  },
  {
    machine: incrementBinaryOneWay,
    description: "Increment a binary number by 1"
  },
]

export const twoWayTapeExamples = [
  {
    machine: incrementBinaryTwoWay,
    description: "Increment a binary number by 1"
  },
]
