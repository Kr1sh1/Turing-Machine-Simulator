import { Box } from "@mui/material";
import { ReactFlowProvider } from "reactflow";
import ComputationTree from "./ComputationTree";
import MachineControls from "./MachineControls";
import Status from "./Status";
import Tape from "./Tape";
import useTuringMachine from "../hooks/useTuringMachine";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SimulatorState, StateType } from "../Enums";
import TransitionSelection from "./TransitionSelection";

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

export default memo(function Simulator({ selections, transitions, oneWayInfiniteTape, setActiveTransitionID }) {
  const tickerID = useRef()
  const [initialValue, setInitialValue] = useState("")
  const [simulatorStatus, setSimulatorStatus] = useState(SimulatorState.PAUSED)
  const [ticks, setTicks] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [nodes, setNodes] = useState([{...makeNode(0, "First Node"), type: "input"}])
  const [edges, setEdges] = useState([])
  const [counter, setCounter] = useState(1)
  const [activeNodeId, setActiveNodeId] = useState("0")
  const [availableTransitions, setAvailableTransitions] = useState([])
  const [
    getCenteredSlice,
    getConfiguration,
    setConfiguration,
    performTransition,
    getTransitions,
    reset,
  ] = useTuringMachine(selections, transitions, oneWayInfiniteTape)

  useEffect(() => {
    if (simulatorStatus !== SimulatorState.RUNNING) return

    const changeActiveNodeClass = (className) => {
      setNodes(nodes =>
        nodes.map(node => {
          if (node.id === activeNodeId) {
            node.className = className
          }
          return node
        })
      )
    }

    const availableTransitions = getTransitions()
    switch (availableTransitions.length) {
      case 0:
        setSimulatorStatus(SimulatorState.TERMINATED)
        let className = undefined
        if (getConfiguration().state === selections[StateType.ACCEPT]) className = "acceptNode"
        else if (getConfiguration().state === selections[StateType.HALT]) className = "haltNode"
        else className = "rejectNode"

        changeActiveNodeClass(className)

        setActiveTransitionID(-1)
        return
      case 1:
        setActiveTransitionID(availableTransitions[0].id)
        performTransition(availableTransitions[0].id)
        const newNode = makeNode(counter, "Not First Node")
        setNodes([...nodes, newNode])
        setCounter(count => count + 1)
        setEdges([...edges, makeEdge(counter, activeNodeId, newNode.id)])
        setActiveNodeId(newNode.id)
        break
      default:
        changeActiveNodeClass("nondetNode")
        setAvailableTransitions(availableTransitions)
        return
    }

    tickerID.current = setTimeout(() => setTicks(ticks + 1) , 1000 / speed)
    return () => clearTimeout(tickerID.current)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks])

  const transitionSelected = (id) => {
    setAvailableTransitions([])
    setActiveTransitionID(id)
    performTransition(id)
    const newNode = makeNode(counter, "Not First Node")
    setNodes([...nodes, newNode])
    setCounter(count => count + 1)
    setEdges([...edges, makeEdge(counter, activeNodeId, newNode.id)])
    setActiveNodeId(newNode.id)
    tickerID.current = setTimeout(() => setTicks(ticks + 1) , 1000 / speed)
  }

  // TODO: Reset Turing machine state to the one at this node
  const nodeClicked = useCallback((event, node) => {}, [])

  const resetPressed = () => {
    stopPressed()
    setActiveTransitionID(-1)
    reset(initialValue)
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
    setAvailableTransitions([])
  }

  return (
    <>
    <Box sx={{ display: "flex" }}>
      <MachineControls
        reset={resetPressed}
        start={startPressed}
        stop={stopPressed}
        setInitialValue={setInitialValue}
        setSpeed={setSpeed}
        simulatorStatus={simulatorStatus} />
      <Tape
        configuration={getConfiguration()}
        getCenteredSlice={getCenteredSlice} />
    </Box>
    <Status simulatorStatus={simulatorStatus} currentState={getConfiguration().state} selections={selections} />
    <ReactFlowProvider>
      <ComputationTree rawNodes={nodes} rawEdges={edges} activeNodeId={activeNodeId} simulatorStatus={simulatorStatus} nodeClicked={nodeClicked} />
    </ReactFlowProvider>
    <TransitionSelection availableTransitions={availableTransitions} transitionSelected={transitionSelected} />
    </>
  )
})
