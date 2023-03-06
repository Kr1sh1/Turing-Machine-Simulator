import { useEffect, useState } from "react";
import StateSelection from "./StateSelection";
import TransitionTable from "./TransitionTable";

export default function TransitionRepresentation({ transitions, setTransitions, selections, setSelections }) {
  const [states, setStates] = useState([]);

  useEffect(() => {
    let uniqueStates = new Set(
      transitions.reduce((nodes, transition) => [...nodes, transition.state, transition.nextState], [])
    )
    uniqueStates.delete("")

    let orderedUniqueStates = [...uniqueStates]
    orderedUniqueStates.sort()

    let selectionsCopy = structuredClone(selections)
    Object.keys(selections).forEach(type => {
      if (selections[type] !== "" && !orderedUniqueStates.includes(selections[type])) {
        selectionsCopy[type] = ""
      }
    })

    setSelections(selectionsCopy)
    setStates(orderedUniqueStates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitions]);

  return (
    <>
    <StateSelection states={states} selections={selections} setSelections={setSelections} />
    <TransitionTable transitions={transitions} setTransitions={setTransitions} />
    </>
  )
}
