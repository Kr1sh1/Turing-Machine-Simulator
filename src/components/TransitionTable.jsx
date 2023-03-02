import { Button, IconButton, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
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

export default function TransitionTable({ update }) {
  const [counter, setCounter] = useState(1)
  const [rows, setRows] = useState([{ id: 0 }])

  const newRow = () => {
    setRows([...rows, { id: counter }])
    setCounter(counter + 1)
  }

  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id))
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
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" inputProps={{ maxLength: 1 }} /></TableCell>
                <TableCell align="center"><TextField size="small" inputProps={{ maxLength: 1 }} /></TableCell>

                <TableCell align="center">
                  <TextField select defaultValue={2} size="small">
                    {moves.map(move => (
                      <MenuItem key={move.value} value={move.value}>
                        {move.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>

                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteRow(row.id)}>
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