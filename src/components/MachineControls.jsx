import { Lock, LockOpen } from "@mui/icons-material";
import { Button, TextField, Box, IconButton, Stack, Slider, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
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
  // {
  //   value: 2,
  //   label: "4x",
  // },
];

export default function MachineControls({
  reset, start, stop, lock, setInitialValue, setSpeed,
  editorIsLocked, simulatorStatus, setOneWayInfiniteTape }) {
  return (
    <Box>
      <Stack direction="row">
        <IconButton disabled={simulatorStatus === SimulatorState.RUNNING} onClick={lock}>
          {editorIsLocked ? <Lock sx={{ color: simulatorStatus === SimulatorState.RUNNING ? "" : "gold" }} /> : <LockOpen sx={{ color: "green" }} />}
        </IconButton>
        <Slider disabled={!editorIsLocked} defaultValue={0} sx={{ margin: "10px" }} min={-1} step={1} max={1} marks={marks} onChange={(event, newValue) => setSpeed(2 ** newValue)} />
      </Stack>
      <FormControl disabled={!editorIsLocked}>
        <FormLabel>Type of infinite tape</FormLabel>
        <RadioGroup defaultValue="1" onChange={event => setOneWayInfiniteTape(event.target.value === "1")}>
          <FormControlLabel value="1" control={<Radio />} label="One-way" />
          <FormControlLabel value="2" control={<Radio />} label="Two-way" />
        </RadioGroup>
      </FormControl>
      <TextField label="Initial Input" margin="normal" fullWidth onChange={(event) => setInitialValue(event.target.value)} disabled={!editorIsLocked} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="info" fullWidth onClick={reset} disabled={!editorIsLocked}>Reset</Button>
        <Button variant="contained" color="success" fullWidth onClick={start} disabled={(simulatorStatus !== SimulatorState.PAUSED) || !editorIsLocked}>Start</Button>
        <Button variant="contained" color="error" fullWidth onClick={stop} disabled={simulatorStatus !== SimulatorState.RUNNING}>Stop</Button>
      </Stack>
    </Box>
  )
}
