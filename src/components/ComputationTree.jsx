import { memo } from 'react';
import ReactFlow, { ConnectionLineType, Controls, useReactFlow } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { SimulatorState } from '../Enums';

/*
The following code was reused from an example given here
https://reactflow.dev/docs/examples/layout/dagre/
*/

const nodeWidth = 150
const nodeHeight = 20

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: "LR" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export default memo(function ComputationTree({ rawNodes, rawEdges, activeNodeId, simulatorStatus, nodeClicked }) {
  const { setCenter } = useReactFlow()

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    rawNodes,
    rawEdges
  );

  const activeNode = layoutedNodes.find(node => node.id === activeNodeId)

  const x = activeNode.position.x + nodeWidth / 2;
  const y = activeNode.position.y + nodeHeight / 2;
  setCenter(x, y, { duration: 250, zoom: 1.5 })

  const simulatorIsNotRunning = simulatorStatus !== SimulatorState.RUNNING

  return (
    <div className="layoutflow" style={{ width: "100%", height: "200px" }}>
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        connectionLineType={ConnectionLineType.SmoothStep}
        onNodeClick={nodeClicked}

        nodesDraggable={false}
        nodesFocusable={simulatorIsNotRunning}
        edgesFocusable={false}
        nodesConnectable={false}
        elementsSelectable={simulatorIsNotRunning}
        panOnDrag={simulatorIsNotRunning}
        zoomOnScroll={simulatorIsNotRunning}
        zoomOnDoubleClick={simulatorIsNotRunning}
        zoomOnPinch={simulatorIsNotRunning}
      >
        <Controls showInteractive={false} showFitView={simulatorIsNotRunning} />
      </ReactFlow>
    </div>
  );
})