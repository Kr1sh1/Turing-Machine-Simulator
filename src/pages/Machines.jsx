import { Box, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Snackbar } from "@mui/material";
import { useState } from "react";
import StateSelection from "../components/StateSelection";
import TransitionTable from "../components/TransitionTable";
import { MoveDirection, StateType } from "../Enums";
import Simulator from "../components/Simulator";
import { Lock, LockOpen } from "@mui/icons-material";

export default function Machines() {
  const [transitions, setTransitions] = useState([
    {
      id: 0,
      state: "s1",
      read: "",
      write: "",
      move: MoveDirection.RIGHT,
      nextState: "s2",
    },
    {
      id: 1,
      state: "s2",
      read: "",
      write: "",
      move: MoveDirection.RIGHT,
      nextState: "s1",
    }
  ])
  const [selections, setSelections] = useState({
    [StateType.INITIAL]: "",
    [StateType.ACCEPT]: "",
    [StateType.REJECT]: "",
  })
  const [editorIsLocked, setEditorIsLocked] = useState(false)
  const [activeTransitionID, setActiveTransitionID] = useState(-1)
  const [oneWayInfiniteTape, setOneWayInfiniteTape] = useState(true)

  const uniqueStates = new Set(
    transitions.reduce(
      (nodes, transition) => [...nodes, transition.state, transition.nextState],
      []
    )
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
    if (editorIsLocked) {
      setEditorIsLocked(!editorIsLocked)
      setActiveTransitionID(-1)
    } else {
      const initSet = selections[StateType.INITIAL] !== ""
      const halting = [selections[StateType.ACCEPT], selections[StateType.REJECT]]
      const invalids = transitions.filter(invalidTransition)
      const haltHasExit = transitions.find(transition => halting.includes(transition.state))
      if (initSet && invalids.length === 0 && !haltHasExit) {
        setEditorIsLocked(!editorIsLocked)
      }
    }
  }

  const invalidTransition = (transition) => {
    return (
      transition.state === "" ||
      transition.nextState === ""
    )
  }

  return (
    <>
    <Snackbar />

    <Box sx={{ display: "flex" }}>
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

    <FormControl disabled={editorIsLocked}>
      <FormLabel>Type of infinite tape</FormLabel>
      <RadioGroup defaultValue="1" onChange={event => setOneWayInfiniteTape(event.target.value === "1")}>
        <FormControlLabel value="1" control={<Radio />} label="One-way" />
        <FormControlLabel value="2" control={<Radio />} label="Two-way" />
      </RadioGroup>
    </FormControl>

    <IconButton onClick={lockPressed}>
      {editorIsLocked ? <Lock sx={{ color: "gold" }} /> : <LockOpen sx={{ color: "green" }} />}
    </IconButton>

    {editorIsLocked &&
    <Simulator
      selections={selections}
      transitions={transitions}
      oneWayInfiniteTape={oneWayInfiniteTape}
      setActiveTransitionID={setActiveTransitionID} />
    }
    </>
  )
}
