import { Casino } from "@mui/icons-material";
import { Button,  FormControlLabel, IconButton, Stack, styled, Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";

const CaseSensitiveButton = styled(Button)(`
  text-transform: none;
`);

export default function TransitionSelection({ availableTransitions, transitionSelected, alwaysPickRandomly, pickRandom, changeAlwaysPick }) {
  return (
    <Box className="component" sx={{ display: "flex", flexDirection: "column", flexBasis: "325px", alignItems: "center", backgroundColor: "teal", color: "white", padding: "10px", justifyContent: "space-between" }}>
      <Typography variant="body1" textAlign={"center"} noWrap sx={{ marginBottom: "10px" }}>
        Available Transitions
      </Typography>
      <Stack spacing={1} sx={{ overflowY: "auto" }}>
        {availableTransitions.map((transition) => (
          <CaseSensitiveButton fullWidth key={transition.id} variant="contained" color="warning" onClick={() => transitionSelected(transition.id)}>
            <Typography>
              Write: {transition.write} | Move: {transition.move} | Next State: {transition.nextState}
            </Typography>
          </CaseSensitiveButton>
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
