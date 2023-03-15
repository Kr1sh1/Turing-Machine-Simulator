import { OneWayInfiniteTape, TwoWayInfiniteTape } from "./Tape"
import {immerable} from "immer"
import { StateType } from "./Enums"

export default class TuringMachine {
  [immerable] = true

  constructor(selections, transitions, initialValue, oneWayInfiniteTape) {
    this.initial = selections[StateType.INITIAL]
    this.accept = selections[StateType.ACCEPT]
    this.reject = selections[StateType.REJECT]
    this.transitions = transitions
    this.oneWayInfiniteTape = oneWayInfiniteTape

    this.state = this.initial
    this.headPosition = 0
    this.tape = this.oneWayInfiniteTape ?
      new OneWayInfiniteTape(initialValue) :
      new TwoWayInfiniteTape(initialValue)
  }

  getConfiguration() {
    return {
      state: this.state,
      headPosition: this.headPosition,
      tape: this.tape
    }
  }

  setConfiguration(configuration) {
    this.state = configuration.state
    this.headPosition = configuration.headPosition
    this.tape = configuration.tape
  }

  getTransitions() {
    return this.transitions.filter(transition =>
      transition.state === this.state &&
      transition.read === this.tape.readCell(this.headPosition)
    )
  }

  performTransition(transitionId) {
    let transition = this.transitions.find(
      transition => transition.id === transitionId
    )

    this.tape.writeCell(this.headPosition, transition.write)
    this.state = transition.nextState

    switch (transition.move) {
      case 0:
        if (!this.oneWayInfiniteTape || this.headPosition !== 0) {
          this.headPosition -= 1
        }
        break
      case 1:
        this.headPosition += 1
        break
      default:
        break;
    }
  }

  reset(initialValue, oneWayInfiniteTape) {
    this.state = this.initial
    this.headPosition = 0
    this.oneWayInfiniteTape = oneWayInfiniteTape
    this.tape = this.oneWayInfiniteTape ?
      new OneWayInfiniteTape(initialValue) :
      new TwoWayInfiniteTape(initialValue)
  }
}
