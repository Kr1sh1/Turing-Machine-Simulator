import { Box, Snackbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import MachineControls from "../components/MachineControls";
import TuringMachine from "../TuringMachine"
import StateSelection from "../components/StateSelection";
import TransitionTable from "../components/TransitionTable";
import Tape from "../components/Tape";
import { useImmer } from "use-immer";
import { SimulatorState, StateType } from "../Enums";
import Status from "../components/Status";
import ComputationTree from "../components/ComputationTree";
import { ReactFlowProvider } from "reactflow";

const makeNode = (id, label) => {
  return {
    id: `${id}`,
    position: { x: 0, y: 0 },
    data: { label: label },
    deletable: false,
    sourcePosition: "right",
    targetPosition: "left",
  }
}

const makeEdge = (id, source, target) => {
  return {
    id: `${id}`,
    source: `${source}`,
    target: `${target}`,
    animated: true,
  }
}

export default function Machines() {
  const [initialValue, setInitialValue] = useState("");
  const [transitions, setTransitions] = useState([
    {
      id: 0,
      state: "s1",
      read: "",
      write: "",
      move: 1,
      nextState: "s2",
    },
    {
      id: 1,
      state: "s2",
      read: "",
      write: "",
      move: 1,
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
  const [simulatorStatus, setSimulatorStatus] = useState(SimulatorState.PAUSED)
  const [turingMachine, updateTuringMachine] = useImmer(new TuringMachine(selections, transitions, initialValue, true))
  const tickerID = useRef()
  const [ticks, setTicks] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [oneWayInfiniteTape, setOneWayInfiniteTape] = useState(true)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [counter, setCounter] = useState(0)
  const [activeNodeId, setActiveNodeId] = useState({})

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

  useEffect(() => {
    if (simulatorStatus !== SimulatorState.RUNNING) return

    const availableTransitions = turingMachine.getTransitions()
    switch (availableTransitions.length) {
      case 0:
        setSimulatorStatus(SimulatorState.TERMINATED)
        setActiveTransitionID(-1)
        return
      case 1:
        setActiveTransitionID(availableTransitions[0].id)
        updateTuringMachine(draft => {
          draft.performTransition(availableTransitions[0].id)
        })
        const newNode = makeNode(counter, "Not First Node")
        setNodes([...nodes, newNode])
        setCounter(count => count + 1)
        setEdges([...edges, makeEdge(counter, activeNodeId, newNode.id)])
        setActiveNodeId(newNode.id)
        break
      default:
        console.log("caseDefault")
        break
    }

    const id = setTimeout(() => setTicks(ticks + 1) , 1000 / speed)
    tickerID.current = id
    return () => clearTimeout(id)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks])

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
        updateTuringMachine(new TuringMachine(selections, transitions, initialValue, oneWayInfiniteTape))
        setSimulatorStatus(SimulatorState.PAUSED)
        const newNode = {...makeNode(counter, "First Node"), type: "input"}
        setNodes([newNode])
        setActiveNodeId(newNode.id)
        setCounter(count => count + 1)
        setEdges([])
      }
    }
  }

  const invalidTransition = (transition) => {
    return (
      transition.state === "" ||
      transition.nextState === ""
    )
  }

  // TODO: Reset Turing machine state to the one at this node
  const nodeClicked = useCallback((event, node) => {}, [])

  const resetPressed = () => {
    stopPressed()
    setActiveTransitionID(-1)
    updateTuringMachine(draft => {
      draft.reset(initialValue, oneWayInfiniteTape)
    })
    const newNode = {...makeNode(counter, "First Node"), type: "input"}
    setNodes([newNode])
    setActiveNodeId(newNode.id)
    setCounter(count => count + 1)
    setEdges([])
  }

  const startPressed = () => {
    setSimulatorStatus(SimulatorState.RUNNING)
    setTicks(ticks + 1)
  }

  const stopPressed = () => {
    setSimulatorStatus(SimulatorState.PAUSED)
    clearTimeout(tickerID)
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

    <Box sx={{ display: "flex" }}>
      <MachineControls
        reset={resetPressed}
        start={startPressed}
        stop={stopPressed}
        lock={lockPressed}
        setInitialValue={setInitialValue}
        setSpeed={setSpeed}
        editorIsLocked={editorIsLocked}
        setOneWayInfiniteTape={setOneWayInfiniteTape}
        simulatorStatus={simulatorStatus} />
      <Tape
        configuration={turingMachine.getConfiguration()} />
    </Box>
    <Status simulatorStatus={simulatorStatus} currentState={turingMachine.state} selections={selections} />
    {editorIsLocked &&
      <ReactFlowProvider>
        <ComputationTree rawNodes={nodes} rawEdges={edges} activeNodeId={activeNodeId} simulatorStatus={simulatorStatus} nodeClicked={nodeClicked} />
      </ReactFlowProvider>
    }
    </>
  )
}
