import { useCallback, useState } from "react"
import { StateType } from "../Enums"
import useTape from "./useTape"

export default function useTuringMachine(selections, transitions, oneWayInfiniteTape) {
  const [state, setState] = useState(selections[StateType.INITIAL])
  const [headPosition, setHeadPosition] = useState(0)
  const [getCenteredSlice, readCell, writeCell, setTape, getTape] = useTape(oneWayInfiniteTape)

  const getTransitions = useCallback(() => {
    return transitions.filter(transition =>
      transition.state === state &&
      transition.read === readCell(headPosition)
    )
  }, [transitions, state, readCell, headPosition])

  const performTransition = useCallback((transitionId) => {
    const transition = getTransitions().find(
      transition => transition.id === transitionId
    )

    writeCell(headPosition, transition.write)
    setState(transition.nextState)

    switch (transition.move) {
      case 0:
        if (!oneWayInfiniteTape || headPosition !== 0) setHeadPosition(head => head - 1)
        break
      case 1:
        setHeadPosition(head => head + 1)
        break
      default:
        break;
    }
  }, [getTransitions, headPosition, writeCell, oneWayInfiniteTape])

  const getConfiguration = useCallback(() => {
    return structuredClone({
      state,
      headPosition,
      tape: getTape()
    })
  }, [state, headPosition, getTape])

  const setConfiguration = useCallback((configuration) => {
    setState(configuration.state)
    setHeadPosition(configuration.headPosition)
    setTape(configuration.tape)
  }, [setTape])

  const reset = useCallback((initialValue) => {
    setTape({
      forwardTape: [...initialValue],
      backwardTape: oneWayInfiniteTape ? null : []
    })
    setHeadPosition(0)
    setState(selections[StateType.INITIAL])
  }, [setTape, oneWayInfiniteTape, selections])

  return [
    getCenteredSlice,
    getConfiguration,
    setConfiguration,
    performTransition,
    getTransitions,
    reset,
  ]
}
