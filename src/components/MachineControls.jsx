import { Lock, LockOpen } from "@mui/icons-material";
import { Button, Grid, TextField, Box, IconButton } from "@mui/material";

export default function MachineControls({
  reset, start, stop, setInitialValue,
  editorIsLocked, setEditorIsLocked, turingMachineIsRunning }) {
  return (
    <Box>
      <IconButton disabled={turingMachineIsRunning} onClick={() => setEditorIsLocked(!editorIsLocked)}>
        {editorIsLocked ? <Lock sx={{ color: "gold" }} /> : <LockOpen sx={{ color: "green" }} />}
      </IconButton>
      <TextField label="Initial Input" margin="normal" fullWidth onChange={(event) => setInitialValue(event.target.value)} disabled={!editorIsLocked} />
      <Grid container className="machine-controls" spacing={1}>
        <Grid item xs={4}>
          <Button variant="contained" color="info" fullWidth onClick={reset} disabled={!editorIsLocked}>Reset</Button>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="success" fullWidth onClick={start} disabled={turingMachineIsRunning || !editorIsLocked}>Start</Button>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="error" fullWidth onClick={stop} disabled={!turingMachineIsRunning}>Stop</Button>
        </Grid>
      </Grid>
    </Box>
  )
}
