import { Box, Chip } from "@mui/material";
import { getIncomers, getOutgoers, ReactFlowProvider } from "reactflow";
import ComputationTree from "./ComputationTree";
import MachineControls from "./MachineControls";
import Status from "./Status";
import Tape from "./Tape";
import useTuringMachine from "../hooks/useTuringMachine";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SimulatorState, StateType } from "../Enums";
import TransitionSelection from "./TransitionSelection";

const makeNode = (id, state) => {
  return {
    id: `${id}`,
    position: { x: 0, y: 0 },
    data: { label: makeLabel(state) },
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

const makeLabel = (state) => {
  return (
    <Chip label={state} size="small" variant="filled" color="secondary" sx={{ cursor: "grab" }} />
  )
}

export default memo(function Simulator({ selections, transitions, oneWayInfiniteTape, setActiveTransitionID }) {
  const tickerID = useRef()
  const [initialValue, setInitialValue] = useState("")
  const [simulatorStatus, setSimulatorStatus] = useState(SimulatorState.PAUSED)
  const [ticks, setTicks] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [nodes, setNodes] = useState([{...makeNode(0, `${selections[StateType.INITIAL]}`), type: "input"}])
  const [edges, setEdges] = useState([])
  const [counter, setCounter] = useState(1)
  const [activeNodeId, setActiveNodeId] = useState("0")
  const [availableTransitions, setAvailableTransitions] = useState([])
  const [
    getCenteredSlice,
    getConfiguration,
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
        const children = getChildren()
        let nextNodeId = undefined
        if (children.length === 0) {
          const newNode = makeNode(counter, `${getConfiguration().state}`)
          nextNodeId = newNode.id
          setNodes([...nodes, {...newNode, data: {...newNode.data, transitionId: availableTransitions[0].id}}])
          setCounter(count => count + 1)
          setEdges([...edges, makeEdge(counter, activeNodeId, newNode.id)])
        } else {
          nextNodeId = children[0].id
        }
        setActiveNodeId(nextNodeId)
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

  const getChildren = () => {
    const currentNode = nodes.find((node) => node.id === activeNodeId)
    return getOutgoers(currentNode, nodes, edges)
  }

  const buildTransitionSequence = useCallback((node) => {
    const ids = []
    let parent = getIncomers(node, nodes, edges)
    while (parent.length === 1) {
      ids.push(node.data.transitionId)
      node = parent[0]
      parent = getIncomers(parent[0], nodes, edges)
    }
    return ids
  }, [nodes, edges])

  const transitionSelected = (id) => {
    setAvailableTransitions([])
    setActiveTransitionID(id)
    performTransition(id)
    const child = getChildren().find(node => node.data.transitionId === id)
    let nextNodeId = undefined
    if (!child) {
      const newNode = makeNode(counter, `${getConfiguration().state}`)
      nextNodeId = newNode.id
      setNodes([...nodes, {...newNode, data: {...newNode.data, transitionId: id}}])
      setCounter(count => count + 1)
      setEdges([...edges, makeEdge(counter, activeNodeId, newNode.id)])
    } else {
      nextNodeId = child.id
    }
    setActiveNodeId(nextNodeId)
    tickerID.current = setTimeout(() => setTicks(ticks + 1) , 1000 / speed)
  }

  const nodeClicked = useCallback((event, node) => {
    if (simulatorStatus === SimulatorState.RUNNING) return
    setActiveNodeId(node.id)
    setActiveTransitionID(node.data.transitionId)
    setSimulatorStatus(SimulatorState.PAUSED)
    const transitionSequence = buildTransitionSequence(node)
    reset()
    for (let index = transitionSequence.length - 1; index >= 0; index--) {
      performTransition(transitionSequence[index])
    }
  }, [buildTransitionSequence, simulatorStatus, setActiveTransitionID, reset, performTransition])

  const resetPressed = () => {
    stopPressed()
    setActiveTransitionID(-1)
    reset(initialValue)
    const newNode = {...makeNode(counter, `${selections[StateType.INITIAL]}`), type: "input"}
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
