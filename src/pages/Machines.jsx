import { Box, Snackbar } from "@mui/material";
import { useState } from "react";
import MachineControls from "../components/MachineControls";
import TuringMachine from "../TuringMachine"
import StateSelection from "../components/StateSelection";
import TransitionTable from "../components/TransitionTable";

export default function Machines() {
  const [initialValue, setInitialValue] = useState("");
  const [transitions, setTransitions] = useState([
    {
      id: 0,
      state: "s1",
      read: "1",
      write: "1",
      move: 0,
      nextState: "s1",
    }])
  const [selections, setSelections] = useState({
    "Initial State": "",
    "Accepting State": "",
    "Rejecting State": "",
  })
  const [editorIsLocked, setEditorIsLocked] = useState(false)
  const [activeTransitionID, setActiveTransitionID] = useState(-1)
  const [turingMachineIsRunning, setTuringMachineIsRunning] = useState(false)
  const [turingMachine, setTuringMachine] = useState()

  const uniqueStates = new Set(
    transitions.reduce((nodes, transition) => [...nodes, transition.state, transition.nextState], [])
  )
  uniqueStates.delete("")

  const states = [...uniqueStates]
  states.sort()

  const selectionsCopy = structuredClone(selections)
  let selectionChanged = false
  Object.keys(selections).forEach(type => {
    if (selections[type] !== "" && !states.includes(selections[type])) {
      selectionsCopy[type] = ""
      selectionChanged = true
    }
  })
  if (selectionChanged) setSelections(selectionsCopy)

  const lockPressed = () => {
    setTuringMachine(new TuringMachine(selections, transitions, initialValue))
  }

  const resetPressed = () => {
    stopPressed()
  }

  const startPressed = () => {
    setTuringMachineIsRunning(true)
  }

  const stopPressed = () => {
    setTuringMachineIsRunning(false)
  }

  return (
    <>
    <Snackbar />

    <Box>
      <StateSelection
        states={states}
        selections={selections}
        setSelections={setSelections}
        editorIsLocked={editorIsLocked} />
      <TransitionTable
        transitions={transitions}
        setTransitions={setTransitions}
        editorIsLocked={editorIsLocked}
        activeTransitionID={activeTransitionID} />
    </Box>

    <Box>
      <MachineControls
        reset={resetPressed}
        start={startPressed}
        stop={stopPressed}
        lock={lockPressed}
        setInitialValue={setInitialValue}
        editorIsLocked={editorIsLocked}
        setEditorIsLocked={setEditorIsLocked}
        turingMachineIsRunning={turingMachineIsRunning} />
    </Box>
    </>
  )
}
