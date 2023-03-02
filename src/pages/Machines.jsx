import { useState } from "react";
import MachineControls from "../components/MachineControls";
import TransitionTable from "../components/TransitionTable";

export default function Machines() {
  const [stopDisabled, setStopDisabled] = useState(true)
  const [startDisabled, setStartDisabled] = useState(false)

  const transitionTableUpdated = () => {

  }

  const resetPressed = (initialValue) => {
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
    <TransitionTable update={transitionTableUpdated} />
    <MachineControls startDisabled={startDisabled}
                     stopDisabled={stopDisabled}
                     reset={resetPressed}
                     start={startPressed}
                     stop={stopPressed} />
    </>
  )
}