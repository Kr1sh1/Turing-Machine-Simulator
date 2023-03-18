export const SimulatorState = Object.freeze({
  RUNNING: "Running",
  PAUSED: "Paused",
  TERMINATED: "Terminated",
})

export const StateType = Object.freeze({
  INITIAL: "Initial State",
  ACCEPT: "Accepting State",
  REJECT: "Rejecting State",
  HALT: "Halting State",
})

export const MoveDirection = Object.freeze({
  LEFT: "Left",
  RIGHT: "Right",
  STAY: "Stay"
})
