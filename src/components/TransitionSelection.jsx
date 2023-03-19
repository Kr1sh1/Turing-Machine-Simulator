import { Casino } from "@mui/icons-material";
import { Button,  FormControlLabel, IconButton, Stack, Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function TransitionSelection({ availableTransitions, transitionSelected, alwaysPickRandomly, pickRandom, changeAlwaysPick }) {
  return (
    <Box className="component" sx={{ display: "flex", flexDirection: "column", backgroundColor: "teal", color: "white", padding: "10px", justifyContent: "space-between" }}>
      <Stack spacing={1}>
        <Typography variant="body1" textAlign={"center"} noWrap>
          Available Transitions
        </Typography>
        {availableTransitions.map((transition) => (
          <Button key={transition.id} variant="contained" color="warning" onClick={() => transitionSelected(transition.id)}>{transition.write} {transition.move} {transition.nextState}</Button>
        ))}
      </Stack>
      <Box sx={{ display: "flex" }}>
        <FormControlLabel control={<Switch checked={alwaysPickRandomly} onChange={() => changeAlwaysPick(availableTransitions, !alwaysPickRandomly)} color="warning" />} label="Always pick randomly" />
        <IconButton disabled={alwaysPickRandomly || availableTransitions.length === 0} onClick={() => pickRandom(availableTransitions)}>
          <Casino />
        </IconButton>
      </Box>
    </Box>
  )
}
