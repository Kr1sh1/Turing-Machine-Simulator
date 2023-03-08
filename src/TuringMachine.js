export default class TuringMachine {
  constructor(selections, transitions, initialValue) {
    this.initialValue = initialValue
    this.initial = selections["Initial State"]
    this.accept = selections["Accepting State"]
    this.reject = selections["Rejecting State"]
    this.transitions = transitions

    // Configuration (state) of the turing machine
    this.currentState = this.initial
    this.currentTapeHeadPosition = 0
    this.tape = [...this.initialValue]
  }

  getConfiguration() {
    return {
      state: this.currentState,
      headPosition: this.currentTapeHeadPosition,
      tape: this.tape
    }
  }

  setConfiguration(configuration) {
    this.currentState = configuration.state
    this.currentTapeHeadPosition = configuration.headPosition
    this.tape = configuration.tape
  }

  getTransitions(readValue) {
    return this.transitions.filter(
      transition => transition.state === this.currentState && transition.read === readValue
    )
  }

  performTransition(transitionId) {
    let transition = this.transitions.find(
      transition => transition.id === transitionId
    )

    this.tape[this.currentTapeHeadPosition] = transition.write
    this.currentState = transition.nextState

    switch (transition.move) {
      case 0:
        if (this.currentTapeHeadPosition !== 0) {
          this.currentTapeHeadPosition -= 1
        }
        break
      case 1:
        if (this.currentTapeHeadPosition === this.tape.length - 1) {
          this.tape.push("")
        }
        this.currentTapeHeadPosition += 1
        break
      default:
        break;
    }

    return this.getConfiguration()
  }

  // resetTape(initialValue) {}
}

var tm = new TuringMachine({
  "Initial State": "s1",
  "Accepting State": "",
  "Rejecting State": "",
}, [
  {
    id: 0, move: 1, nextState: "s2", read: "", state: "s1", write: "0"
  },
  {
    id: 1, move: 1, nextState: "s3", read: "", state: "s2", write: ""
  },
  {
    id: 2, move: 1, nextState: "s4", read: "", state: "s3", write: "1"
  },
  {
    id: 3, move: 1, nextState: "s1", read: "", state: "s4", write: ""
  },
], "")

// Need to get the next transitions given an input
// Need to choose the next transition
