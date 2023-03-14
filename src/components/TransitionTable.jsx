import {
  Box, Button, IconButton, MenuItem,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  TextField } from "@mui/material";

import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear"

const moves = [
  {
    value: 0,
    label: "Left",
  },

  {
    value: 1,
    label: "Right",
  },

  {
    value: 2,
    label: "Stay",
  },
]

const defaultTransition = {
  id: 0,
  state: "",
  read: "",
  write: "",
  move: 1,
  nextState: "",
}

export default function TransitionTable({ transitions, setTransitions, editorIsLocked, activeTransitionID }) {
  const [counter, setCounter] = useState(2)

  const newRow = () => {
    const transition = structuredClone(defaultTransition)
    transition.id = counter
    setTransitions([...transitions, transition])
    setCounter(counter + 1)
  }

  const deleteRow = (id) => {
    setTransitions(transitions.filter(transition => transition.id !== id))
  }

  const transitionUpdate = (event, id, column) => {
    const index = transitions.findIndex(transition => transition.id === id)
    const newTransitions = structuredClone(transitions)
    newTransitions[index][column] = event.target.value
    setTransitions(newTransitions)
  }

  return (
    <Box sx={{ flexGrow: 1, minWidth: "0" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">State</TableCell>
              <TableCell align="center">Read</TableCell>
              <TableCell align="center">Write</TableCell>
              <TableCell align="center">Move</TableCell>
              <TableCell align="center">Next State</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {transitions.map(transition => (
              <TableRow key={transition.id} sx={{ backgroundColor: transition.id === activeTransitionID ? "green" : "white" }}>
                <TableCell align="center"><TextField disabled={editorIsLocked} size="small" value={transition.state} onChange={event => transitionUpdate(event, transition.id, "state")} /></TableCell>
                <TableCell align="center"><TextField disabled={editorIsLocked} size="small" value={transition.read} onChange={event => transitionUpdate(event, transition.id, "read")} inputProps={{ maxLength: 1 }} /></TableCell>
                <TableCell align="center"><TextField disabled={editorIsLocked} size="small" value={transition.write} onChange={event => transitionUpdate(event, transition.id, "write")} inputProps={{ maxLength: 1 }} /></TableCell>

                <TableCell align="center">
                  <TextField disabled={editorIsLocked} size="small" select value={transition.move} onChange={event => transitionUpdate(event, transition.id, "move")}>
                    {moves.map(move => (
                      <MenuItem key={move.value} value={move.value}>
                        {move.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>

                <TableCell align="center"><TextField disabled={editorIsLocked} size="small" value={transition.nextState} onChange={event => transitionUpdate(event, transition.id, "nextState")} /></TableCell>
                <TableCell>
                  <IconButton disabled={editorIsLocked} onClick={() => deleteRow(transition.id)}>
                    <ClearIcon color={editorIsLocked ? "disabled" : "error"} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }} disabled={editorIsLocked} fullWidth onClick={newRow}>+</Button>
    </Box>
  )
}
