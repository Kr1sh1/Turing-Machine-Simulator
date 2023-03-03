import { useEffect, useState } from "react";
import StateSelection from "./StateSelection";
import TransitionTable from "./TransitionTable";

export default function TransitionRepresentation({ transitions, setTransitions }) {
  const [states, setStates] = useState([]);

  useEffect(() => {
    let uniqueStates = new Set(
      transitions.reduce((nodes, transition) => [...nodes, transition.state, transition.nextState], [])
    )
    uniqueStates.delete("")

    let orderedUniqueStates = [...uniqueStates]
    orderedUniqueStates.sort()

    setStates(orderedUniqueStates)
  }, [transitions]);

  return (
    <>
    <StateSelection states={states}/>
    <TransitionTable transitions={transitions} setTransitions={setTransitions} />
    </>
  )
}