import { useCallback, useState } from "react"
import { StateType } from "../Enums"
import useTape from "./useTape"

export default function useTuringMachine(selections, transitions, oneWayInfiniteTape) {
  const [state, setState] = useState(selections[StateType.INITIAL])
  const [headPosition, setHeadPosition] = useState()
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
        if (!oneWayInfiniteTape || headPosition !== 0) {
          setHeadPosition(headPosition - 1)
        }
        break
      case 1:
        setHeadPosition(headPosition + 1)
        break
      default:
        break;
    }
  }, [getTransitions, headPosition, writeCell, oneWayInfiniteTape])

  const getConfiguration = useCallback(() => {
    return {
      state,
      headPosition,
      tape: getTape()
    }
  }, [state, headPosition, getTape])

  const setConfiguration = useCallback((configuration) => {
    setState(configuration.state)
    setHeadPosition(configuration.headPosition)
    setTape(configuration.tape)
  }, [setTape])

  return [
    getCenteredSlice,
    getConfiguration,
    setConfiguration,
    performTransition,
    getTransitions
  ]
}
