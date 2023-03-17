import { Button, Stack } from "@mui/material";

export default function TransitionSelection({ availableTransitions, transitionSelected }) {
  return (
    <Stack spacing={1}>
      Available Transitions
      {availableTransitions.map((transition) => (
        <Button key={transition.id} variant="contained" onClick={() => transitionSelected(transition.id)}>{transition.write} {transition.move} {transition.nextState}</Button>
      ))}
    </Stack>
  )
}
