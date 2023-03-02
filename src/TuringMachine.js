class TuringMachine {
  constructor(initialValue, twoWayInfiniteTape = false) {}
  addState(stateName) {}
  addEdge(fromState, toState, readSymbol, writeSymbol, moveDirection) {}
  setInitialState(stateName) {}
  setHaltingState(stateName) {}
  setAcceptingState(stateName) {}
  setRejectingState(stateName) {}
  resetTape(initialValue) {}
}

var tm = new TuringMachine("SIMULATOR", true)