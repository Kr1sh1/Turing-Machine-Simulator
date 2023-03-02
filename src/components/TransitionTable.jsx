import {
  Button, IconButton, MenuItem,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  TextField } from "@mui/material";

import { Box } from "@mui/system";
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
  move: 0,
  nextState: "",
}

export default function TransitionTable({ transitions, setTransitions }) {
  const [counter, setCounter] = useState(1)

  const newRow = () => {
    let transition = structuredClone(defaultTransition)
    transition.id = counter
    setTransitions([...transitions, transition])
    setCounter(counter + 1)
  }

  const deleteRow = (id) => {
    setTransitions(transitions.filter(transition => transition.id !== id))
  }

  const transitionUpdate = (event, id, eventType) => {
    let index = transitions.findIndex(transition => transition.id === id)
    let newTransitions = structuredClone(transitions)

    switch (eventType) {
      case 0:
        newTransitions[index].state = event.target.value
        break
      case 1:
        newTransitions[index].read = event.target.value
        break
      case 2:
        newTransitions[index].write = event.target.value
        break
      case 3:
        newTransitions[index].move = event.target.value
        break
      case 4:
        newTransitions[index].nextState = event.target.value
        break
      default:
        break;
    }
    setTransitions(newTransitions)
  }

  return (
    <Box>
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
              <TableRow key={transition.id}>
                <TableCell align="center"><TextField size="small" defaultValue={transition.state} onChange={event => transitionUpdate(event, transition.id, 0)} /></TableCell>
                <TableCell align="center"><TextField size="small" defaultValue={transition.read} onChange={event => transitionUpdate(event, transition.id, 1)} inputProps={{ maxLength: 1 }} /></TableCell>
                <TableCell align="center"><TextField size="small" defaultValue={transition.write} onChange={event => transitionUpdate(event, transition.id, 2)} inputProps={{ maxLength: 1 }} /></TableCell>

                <TableCell align="center">
                  <TextField size="small" select defaultValue={transition.move} onChange={event => transitionUpdate(event, transition.id, 3)}>
                    {moves.map(move => (
                      <MenuItem key={move.value} value={move.value}>
                        {move.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>

                <TableCell align="center"><TextField size="small" defaultValue={transition.nextState} onChange={event => transitionUpdate(event, transition.id, 4)} /></TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteRow(transition.id)}>
                    <ClearIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }} fullWidth onClick={newRow}>+</Button>
    </Box>
  )
}