import { memo, useMemo } from 'react';
import ReactFlow, { ConnectionLineType, Controls, useReactFlow } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { SimulatorState } from '../Enums';
import { Box } from '@mui/material';

const nodeWidth = 150
const nodeHeight = 46

export default memo(function ComputationTree({ rawNodes, rawEdges, activeNodeId, simulatorStatus, nodeClicked }) {
  const { setCenter } = useReactFlow()

  /*
  The following function was adapted from an example given here
  https://reactflow.dev/docs/examples/layout/dagre/
  */
  let layoutedNodes = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: "LR" });

    rawNodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    rawEdges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return rawNodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });
  }, [rawEdges, rawNodes])

  const activeNodeIndex = layoutedNodes.findIndex(node => node.id === activeNodeId)

  layoutedNodes = layoutedNodes.map(node => {
    node.selected = false
    return node
  })
  layoutedNodes[activeNodeIndex].selected = true

  const x = layoutedNodes[activeNodeIndex].position.x + nodeWidth / 2;
  const y = layoutedNodes[activeNodeIndex].position.y + nodeHeight / 2;
  setCenter(x, y, { duration: 250, zoom: 1.25 })

  const simulatorIsNotRunning = simulatorStatus !== SimulatorState.RUNNING

  return (
    <Box className="component" sx={{ flexGrow: "1", minWidth: "0", marginRight: "1px", backgroundColor: "burlywood" }}>
      <ReactFlow
        proOptions={{ hideAttribution: true }}

        nodes={layoutedNodes}
        edges={rawEdges}
        connectionLineType={ConnectionLineType.SmoothStep}
        onNodeClick={nodeClicked}
        onlyRenderVisibleElements={true}

        nodesDraggable={false}
        nodesFocusable={simulatorIsNotRunning}
        edgesFocusable={false}
        nodesConnectable={false}
        elementsSelectable={simulatorIsNotRunning}
        panOnDrag={simulatorIsNotRunning}
        zoomOnScroll={simulatorIsNotRunning}
        zoomOnDoubleClick={false}
        zoomOnPinch={simulatorIsNotRunning}
      >
        <Controls showInteractive={false} showFitView={simulatorIsNotRunning} />
      </ReactFlow>
    </Box>
  );
})
