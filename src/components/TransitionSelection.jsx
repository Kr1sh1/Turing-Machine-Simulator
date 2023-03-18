import { Button, Stack, Typography } from "@mui/material";

export default function TransitionSelection({ availableTransitions, transitionSelected }) {
  return (
    <Stack spacing={1} className="component" sx={{ backgroundColor: "tomato", color: "white", padding: "10px" }}>
      <Typography variant="body1" textAlign={"center"} noWrap>
        Available Transitions
      </Typography>
      {availableTransitions.map((transition) => (
        <Button key={transition.id} variant="contained" onClick={() => transitionSelected(transition.id)}>{transition.write} {transition.move} {transition.nextState}</Button>
      ))}
    </Stack>
  )
}
