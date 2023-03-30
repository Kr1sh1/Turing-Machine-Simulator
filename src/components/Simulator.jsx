import { Box, Chip } from "@mui/material";
import { getIncomers, getOutgoers, ReactFlowProvider } from "reactflow";
import ComputationTree from "./MachineComponents/ComputationTree";
import MachineControls from "./MachineComponents/MachineControls";
import Status from "./MachineComponents/Status";
import Tape from "./MachineComponents/Tape";
import useTuringMachine from "../hooks/useTuringMachine";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SimulatorState, StateType } from "../Enums";
import TransitionSelection from "./MachineComponents/TransitionSelection";
import { enqueueSnackbar } from "notistack";
import { leftEndMarker } from "../Constants";
import { MoveDirection } from "../Enums";

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

const makeEdge = (id, source, target, label) => {
  return {
    id: `${id}`,
    source: `${source}`,
    target: `${target}`,
    animated: true,
    label: label,
    type: "straight"
  }
}

const makeEdgeLabel = (transition) => {
  const translateDirection = {
    [MoveDirection.RIGHT]: ">",
    [MoveDirection.LEFT]: "<",
    [MoveDirection.STAY]: "|",
  }
  return "Write: " + transition.write + " Move: " + translateDirection[transition.move]
}

const makeLabel = (state) => {
  return (
    <Chip label={state} size="small" variant="filled" color="secondary" sx={{ cursor: "grab" }} />
  )
}

export default memo(function Simulator({ selections, transitions, oneWayInfiniteTape, haltingState, setActiveTransitionID }) {
  const tickerID = useRef()
  const counter = useRef(1)
  const [initialValue, setInitialValue] = useState("")
  const [simulatorStatus, setSimulatorStatus] = useState(SimulatorState.PAUSED)
  const [ticks, setTicks] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [nodes, setNodes] = useState([{...makeNode(0, `${selections[StateType.INITIAL]}`), type: "input"}])
  const [edges, setEdges] = useState([])
  const [activeNodeId, setActiveNodeId] = useState("0")
  const [availableTransitions, setAvailableTransitions] = useState([])
  const [alwaysPickRandomly, setAlwaysPickRandomly] = useState(false)
  const [numComputationsDiscovered, setNumComputationsDiscovered] = useState(1)
  const [numComputationsTerminated, setNumComputationsTerminated] = useState(0)
  const [acceptingComputationFound, setAcceptingComputationFound] = useState(false)
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

    const changeActiveNodeType = (type) => {
      setNodes(nodes =>
        nodes.map(node => {
          if (node.id === activeNodeId) {
            node.type = type
          }
          return node
        })
      )
    }

    const availableTransitions = getTransitions()
    const currentNode = nodes.find(node => node.id === activeNodeId)
    const visited = currentNode.type === "output" || currentNode.className === "nondetNode"
    switch (availableTransitions.length) {
      case 0:
        setSimulatorStatus(SimulatorState.TERMINATED)

        if (!visited) {
          let className = undefined
          if (haltingState) className = "haltNode"
          else if (getConfiguration().state === selections[StateType.ACCEPT]) {
            className = "acceptNode"
            setAcceptingComputationFound(true)
          }
          else className = "rejectNode"

          changeActiveNodeClass(className)
          changeActiveNodeType("output")
          setNumComputationsTerminated(num => num + 1)
        }

        setActiveTransitionID(-1)
        return
      case 1:
        const transition = availableTransitions[0]
        setActiveTransitionID(transition.id)
        performTransition(transition.id)
        const children = getChildren()
        let nextNodeId = undefined
        if (children.length === 0) {
          const newNode = makeNode(counter.current, `${getConfiguration().state}`)
          nextNodeId = newNode.id
          setNodes([...nodes, {...newNode, data: {...newNode.data, transitionId: transition.id}}])
          setEdges([...edges, makeEdge(counter.current + 1, activeNodeId, newNode.id, makeEdgeLabel(transition))])
          counter.current += 2
        } else {
          nextNodeId = children[0].id
        }
        setActiveNodeId(nextNodeId)
        break
      default:
        if (!visited) {
          changeActiveNodeClass("nondetNode")
          setNumComputationsDiscovered(num => num + availableTransitions.length - 1)
        }

        if (alwaysPickRandomly) pickRandom(availableTransitions)
        else setAvailableTransitions(availableTransitions)

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
      const newNode = makeNode(counter.current, `${getConfiguration().state}`)
      nextNodeId = newNode.id
      setNodes([...nodes, {...newNode, data: {...newNode.data, transitionId: id}}])
      const transition = transitions.find(transition => transition.id === id)
      setEdges([...edges, makeEdge(counter.current + 1, activeNodeId, newNode.id, makeEdgeLabel(transition))])
      counter.current += 2
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

  const changeAlwaysPickRandom = (availableTransitions, alwaysPick) => {
    setAlwaysPickRandomly(alwaysPick)
    if (availableTransitions.length !== 0) pickRandom(availableTransitions)
  }
  const pickRandom = (availableTransitions) => {
    const transition = availableTransitions[Math.floor(Math.random() * availableTransitions.length)]
    transitionSelected(transition.id)
  }

  const resetPressed = () => {
    if (initialValue.includes(leftEndMarker)) {
      enqueueSnackbar("Initial value cannot contain left-end marker", {variant: "error"})
      return
    }
    setAcceptingComputationFound(false)
    setNumComputationsDiscovered(1)
    setNumComputationsTerminated(0)
    stopPressed()
    setActiveTransitionID(-1)
    reset(initialValue)
    const newNode = {...makeNode(counter.current, `${selections[StateType.INITIAL]}`), type: "input"}
    setNodes([newNode])
    setActiveNodeId(newNode.id)
    counter.current += 1
    setEdges([])
  }

  const startPressed = () => {
    setSimulatorStatus(SimulatorState.RUNNING)
    setTicks(ticks + 1)
  }

  const stopPressed = () => {
    setSimulatorStatus(SimulatorState.PAUSED)
    clearTimeout(tickerID.current)
    setAvailableTransitions([])
  }

  return (
    <>
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ display: "flex" }}>
        <Box className="component" sx={{ padding: "10px", backgroundColor: "whitesmoke", marginRight: "1px" }}>
          <MachineControls
            reset={resetPressed}
            start={startPressed}
            stop={stopPressed}
            setInitialValue={setInitialValue}
            setSpeed={setSpeed}
            simulatorStatus={simulatorStatus} />
          <Status
            numComputationsDiscovered={numComputationsDiscovered}
            numComputationsTerminated={numComputationsTerminated}
            acceptingComputationFound={acceptingComputationFound} />
        </Box>

        <Box className="component" sx={{ display: "flex", flexGrow: "1", minWidth: "0", backgroundColor: "lightgreen" }}>
          <Tape
            configuration={getConfiguration()}
            getCenteredSlice={getCenteredSlice} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "stretch", marginTop: "1px", flexGrow: "1" }}>
        <ReactFlowProvider>
          <ComputationTree
            rawNodes={nodes}
            rawEdges={edges}
            activeNodeId={activeNodeId}
            simulatorStatus={simulatorStatus}
            nodeClicked={nodeClicked} />
        </ReactFlowProvider>

        <TransitionSelection
          availableTransitions={availableTransitions}
          transitionSelected={transitionSelected}
          alwaysPickRandomly={alwaysPickRandomly}
          changeAlwaysPick={changeAlwaysPickRandom}
          pickRandom={pickRandom} />
      </Box>
    </Box>
    </>
  )
})
