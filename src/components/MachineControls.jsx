import { Button, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";

export default function MachineControls({ startDisabled, stopDisabled, reset, start, stop, setInitialValue }) {
  return (
    <Box>
      <TextField label="Initial Input" margin="normal" fullWidth onChange={(event) => setInitialValue(event.target.value)} />
      <Grid container className="machine-controls" spacing={1}>
        <Grid item sm={4}>
          <Button variant="contained" color="info" fullWidth onClick={reset}>Reset</Button>
        </Grid>
        <Grid item sm={4}>
          <Button variant="contained" color="success" fullWidth onClick={start} disabled={startDisabled}>Start</Button>
        </Grid>
        <Grid item sm={4}>
          <Button variant="contained" color="error" fullWidth onClick={stop} disabled={stopDisabled}>Stop</Button>
        </Grid>
      </Grid>
    </Box>
  )
}
