import { useCallback, useRef } from "react"
import { StateType } from "../Enums"
import useTape from "./useTape"

export default function useTuringMachine(selections, transitions, oneWayInfiniteTape) {
  const state = useRef(selections[StateType.INITIAL])
  const headPosition = useRef(0)
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

    writeCell(headPosition.current, transition.write)
    state.current = transition.nextState

    switch (transition.move) {
      case 0:
        if (!oneWayInfiniteTape || headPosition.current !== 0) headPosition.current -= 1
        break
      case 1:
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
      forwardTape: [...initialValue],
      backwardTape: oneWayInfiniteTape ? null : []
    })
    headPosition.current = 0
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
