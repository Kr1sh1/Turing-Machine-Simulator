import { useCallback, useRef } from "react"
import { leftEndMarker } from "../Constants"
import { MoveDirection, StateType } from "../Enums"
import useTape from "./useTape"

export default function useTuringMachine(selections, transitions, oneWayInfiniteTape) {
  const state = useRef(selections[StateType.INITIAL])
  const headPosition = useRef(oneWayInfiniteTape ? 1 : 0)
  const [getCenteredSlice, readCell, writeCell, setTape, getTape] = useTape(oneWayInfiniteTape)
  const lastInitialValue = useRef("")

  const getTransitions = useCallback(() => {
    return transitions.filter(transition =>
      transition.state === state.current &&
      transition.read === readCell(headPosition.current)
    )
  }, [transitions, readCell])

  const performTransition = useCallback((transitionId) => {
    const transition = getTransitions().find(
      transition => transition.id === transitionId
    )

    state.current = transition.nextState

    if (oneWayInfiniteTape && headPosition.current === 0) {
      headPosition.current += 1
      return
    }

    writeCell(headPosition.current, transition.write)

    switch (transition.move) {
      case MoveDirection.LEFT:
        if (!oneWayInfiniteTape || headPosition.current !== 0) headPosition.current -= 1
        break
      case MoveDirection.RIGHT:
        headPosition.current += 1
        break
      default:
        break;
    }
  }, [getTransitions, writeCell, oneWayInfiniteTape])

  const getConfiguration = useCallback(() => {
    return structuredClone({
      state: state.current,
      headPosition: headPosition.current,
      tape: getTape()
    })
  }, [getTape])

  const reset = useCallback((initialValue = lastInitialValue.current) => {
    setTape({
      forwardTape: oneWayInfiniteTape ? [leftEndMarker, ...initialValue] : [...initialValue],
      backwardTape: oneWayInfiniteTape ? null : []
    })
    headPosition.current = oneWayInfiniteTape ? 1 : 0
    state.current = selections[StateType.INITIAL]
    lastInitialValue.current = initialValue
  }, [setTape, oneWayInfiniteTape, selections])

  return [
    getCenteredSlice,
    getConfiguration,
    performTransition,
    getTransitions,
    reset,
  ]
}
