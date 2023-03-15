import { Box } from "@mui/material";
import { ReactFlow } from "reactflow";

import 'reactflow/dist/style.css';

const nodes = [
  {
    id: "0",
    position: { x: 0, y: 0 },
    data: { label: "Node 0" },
    draggable: false,
    deletable: false,
    type: "input",
    sourcePosition: "right",
  },
  {
    id: "1",
    position: { x: 300, y: 0 },
    data: { label: "Node 1" },
    draggable: false,
    deletable: false,
    sourcePosition: "right",
    targetPosition: "left",
    selected: true,
  },
]

const edges = [
  { id: '1-2', source: '0', target: '1' }
];

export default function ComputationTree() {
  return (
    <Box sx={{ width: "100vh", height: "100px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        proOptions={{ hideAttribution: true }} />
    </Box>
  )
}