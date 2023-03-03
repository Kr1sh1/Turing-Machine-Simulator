import { useState } from "react";
import MachineControls from "../components/MachineControls";
import TransitionTable from "../components/TransitionTable";

export default function Machines() {
  const [stopDisabled, setStopDisabled] = useState(true)
  const [startDisabled, setStartDisabled] = useState(false)
  const [initialValue, setInitialValue] = useState("");
  const [transitions, setTransitions] = useState(
    [
      {
        id: 0,
        state: "s1",
        read: "1",
        write: "1",
        move: 0,
        nextState: "s1",
      }
    ]
  )

  const resetPressed = () => {
    console.log(initialValue)
    setStartDisabled(false)
    setStopDisabled(true)
  }

  const startPressed = () => {
    setStartDisabled(true)
    setStopDisabled(false)
  }

  const stopPressed = () => {
    setStartDisabled(false)
    setStopDisabled(true)
  }

  return (
    <>
    <TransitionTable
      transitions={transitions}
      setTransitions={setTransitions} />

    <MachineControls
      startDisabled={startDisabled}
      stopDisabled={stopDisabled}
      reset={resetPressed}
      start={startPressed}
      stop={stopPressed}
      setInitialValue={setInitialValue} />
    </>
  )
}
