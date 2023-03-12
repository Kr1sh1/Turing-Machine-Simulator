import { Lock, LockOpen } from "@mui/icons-material";
import { Button, TextField, Box, IconButton, Stack, Slider } from "@mui/material";

const marks = [
  {
    value: -1,
    label: "0.5x"
  },
  {
    value: 0,
    label: "1x",
  },
  {
    value: 1,
    label: "2x",
  },
  // {
  //   value: 2,
  //   label: "4x",
  // },
];

export default function MachineControls({
  reset, start, stop, lock, setInitialValue, setSpeed,
  editorIsLocked, turingMachineIsRunning }) {
  return (
    <Box>
      <Stack direction="row">
        <IconButton disabled={turingMachineIsRunning} onClick={lock}>
          {editorIsLocked ? <Lock sx={{ color: turingMachineIsRunning ? "" : "gold" }} /> : <LockOpen sx={{ color: "green" }} />}
        </IconButton>
        <Slider defaultValue={0} sx={{ margin: "10px" }} min={-1} step={1} max={1} marks={marks} onChange={(event, newValue) => setSpeed(2 ** newValue)} />
      </Stack>
      <TextField label="Initial Input" margin="normal" fullWidth onChange={(event) => setInitialValue(event.target.value)} disabled={!editorIsLocked} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="info" fullWidth onClick={reset} disabled={!editorIsLocked}>Reset</Button>
        <Button variant="contained" color="success" fullWidth onClick={start} disabled={turingMachineIsRunning || !editorIsLocked}>Start</Button>
        <Button variant="contained" color="error" fullWidth onClick={stop} disabled={!turingMachineIsRunning}>Stop</Button>
      </Stack>
    </Box>
  )
}
