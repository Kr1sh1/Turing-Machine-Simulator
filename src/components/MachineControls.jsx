import { Lock, LockOpen } from "@mui/icons-material";
import { Button, TextField, Box, IconButton, Stack } from "@mui/material";

export default function MachineControls({
  reset, start, stop, setInitialValue,
  editorIsLocked, setEditorIsLocked, turingMachineIsRunning }) {
  return (
    <Box>
      <IconButton disabled={turingMachineIsRunning} onClick={() => setEditorIsLocked(!editorIsLocked)}>
        {editorIsLocked ? <Lock sx={{ color: turingMachineIsRunning ? "" : "gold" }} /> : <LockOpen sx={{ color: "green" }} />}
      </IconButton>
      <TextField label="Initial Input" margin="normal" fullWidth onChange={(event) => setInitialValue(event.target.value)} disabled={!editorIsLocked} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="info" fullWidth onClick={reset} disabled={!editorIsLocked}>Reset</Button>
        <Button variant="contained" color="success" fullWidth onClick={start} disabled={turingMachineIsRunning || !editorIsLocked}>Start</Button>
        <Button variant="contained" color="error" fullWidth onClick={stop} disabled={!turingMachineIsRunning}>Stop</Button>
      </Stack>
    </Box>
  )
}
