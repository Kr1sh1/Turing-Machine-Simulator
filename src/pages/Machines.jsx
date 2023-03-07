import { useState } from "react";
import MachineControls from "../components/MachineControls";
import TransitionRepresentation from "../components/TransitionRepresentation";

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
    <TransitionRepresentation
      transitions={transitions}
      setTransitions={setTransitions}
      selections={selections}
      setSelections={setSelections}
      editorIsLocked={editorIsLocked}
      activeTransitionID={activeTransitionID} />

    <MachineControls
      reset={resetPressed}
      start={startPressed}
      stop={stopPressed}
      setInitialValue={setInitialValue}
      editorIsLocked={editorIsLocked}
      setEditorIsLocked={setEditorIsLocked}
      turingMachineIsRunning={turingMachineIsRunning} />
    </>
  )
}
