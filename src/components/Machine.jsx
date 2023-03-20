import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar } from "@mui/material";
import { useState } from "react";
import StateSelection from "./MachineComponents/StateSelection";
import TransitionTable from "./MachineComponents/TransitionTable";
import { MoveDirection, StateType } from "../Enums";
import Simulator from "./Simulator";
import { Lock, LockOpen } from "@mui/icons-material";
import { Stack } from "@mui/system";

export default function Machine() {
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
    [StateType.INITIAL]: "s1",
    [StateType.HALT]: "",
    [StateType.ACCEPT]: "",
    [StateType.REJECT]: "",
  })
  const [editorIsLocked, setEditorIsLocked] = useState(false)
  const [activeTransitionID, setActiveTransitionID] = useState(-1)
  const [oneWayInfiniteTape, setOneWayInfiniteTape] = useState(true)
  const [haltingState, setHaltingState] = useState(true)

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
      const halting = [selections[StateType.ACCEPT], selections[StateType.REJECT], selections[StateType.HALT]]
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

  const handleStateTypeChange = (isHalting) => {
    setHaltingState(isHalting)
    if (isHalting) {
      setSelections(selections => (
        {...selections, [StateType.ACCEPT]: "", [StateType.REJECT]: ""}
      ))
    } else {
      setSelections(selections => (
        {...selections, [StateType.HALT]: ""}
      ))
    }
  }

  return (
    <>
    <Snackbar />

    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ display: "flex", marginBottom: "1px", maxHeight: "273px" }}>
        <Box className="component" sx={{ padding: "10px", backgroundColor: "thistle" }}>
          <Box sx={{ display: "flex" }}>
            <Stack sx={{ width: "200px" }}>
              <FormControl disabled={editorIsLocked}>
                <FormLabel>Type of infinite tape</FormLabel>
                <RadioGroup value={oneWayInfiniteTape ? "1" : "2"} onChange={event => setOneWayInfiniteTape(event.target.value === "1")}>
                  <FormControlLabel value="1" control={<Radio />} label="One-way" />
                  <FormControlLabel value="2" control={<Radio />} label="Two-way" />
                </RadioGroup>
              </FormControl>

              <FormControl disabled={editorIsLocked}>
                <FormLabel>Type of terminal states</FormLabel>
                <RadioGroup value={haltingState ? "1" : "2"} onChange={event => handleStateTypeChange(event.target.value === "1")}>
                  <FormControlLabel value="1" control={<Radio />} label="Halt" />
                  <FormControlLabel value="2" control={<Radio />} label="Accept & Reject" />
                </RadioGroup>
              </FormControl>
            </Stack>

            <Box sx={{}}>
              <StateSelection
                  states={states}
                  selections={selections}
                  setSelections={setSelections}
                  haltingState={haltingState}
                  editorIsLocked={editorIsLocked} />
            </Box>
          </Box>
          <Button fullWidth onClick={lockPressed} color="error" variant="contained" endIcon={!editorIsLocked ? <Lock sx={{ color: "gold" }} /> : <LockOpen sx={{ color: "green" }} />}>
            {editorIsLocked ? "Edit Turing Machine" : "Create Turing Machine"}
          </Button>
        </Box>

        <TransitionTable
          transitions={transitions}
          setTransitions={setTransitions}
          editorIsLocked={editorIsLocked}
          activeTransitionID={activeTransitionID} />
      </Box>

      <Box sx={{ flexGrow: "1", height: "100%" }}>
        {!editorIsLocked &&
          <Box className="component" sx={{ display: "flex",
                                           flexDirection: "column",
                                           height: "100%",
                                           alignItems: "stretch",
                                           justifyContent: "center",
                                           textAlign: "center",
                                           backgroundColor: "gold" }}>
            <h1>
              UNDER CONSTRUCTION
            </h1>
          </Box>
        }
        {editorIsLocked &&
          <Simulator
            selections={selections}
            transitions={transitions}
            oneWayInfiniteTape={oneWayInfiniteTape}
            haltingState={haltingState}
            setActiveTransitionID={setActiveTransitionID} />
        }
      </Box>
    </Box>
    </>
  )
}
