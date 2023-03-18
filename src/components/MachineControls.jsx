import { Button, TextField, Box, Stack, Slider } from "@mui/material";
import { SimulatorState } from "../Enums";

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
];

export default function MachineControls({reset, start, stop, setInitialValue, setSpeed, simulatorStatus }) {
  return (
    <Box>
      <Slider defaultValue={0} sx={{ margin: "10px" }} min={-1} step={1} max={1} marks={marks} onChange={(event, newValue) => setSpeed(2 ** newValue)} />
      <TextField label="Initial Input" margin="normal" fullWidth onChange={(event) => setInitialValue(event.target.value)} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="info" fullWidth onClick={reset}>Reset</Button>
        <Button variant="contained" color="success" fullWidth onClick={start} disabled={(simulatorStatus !== SimulatorState.PAUSED)}>Start</Button>
        <Button variant="contained" color="error" fullWidth onClick={stop} disabled={simulatorStatus !== SimulatorState.RUNNING}>Stop</Button>
      </Stack>
    </Box>
  )
}
