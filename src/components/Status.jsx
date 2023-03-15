import { Box, Typography } from "@mui/material";
import { SimulatorState, StateType } from "../Enums";

export default function Status({ simulatorStatus, currentState, selections }) {
  let color = "grey"
  let subtext = null

  if (simulatorStatus === SimulatorState.TERMINATED) {
    switch (currentState) {
      case selections[StateType.ACCEPT]:
        color = "green"
        subtext = "Input Accepted"
        break;

      case selections[StateType.HALT]:
        color = "blue"
        break;

      default:
        color = "red"
        subtext = "Input Rejected"
        break;
    }
  }

  return (
    <Box className={simulatorStatus} sx={{ display: "flex", flexDirection: "column", borderRadius: "10px", height: "60px", width: "150px", backgroundColor: color, justifyContent: "center", textAlign: "center" }}>
      <Typography variant="h5">
        {simulatorStatus}
      </Typography>
      {subtext &&
        <Typography variant="caption">
          {subtext}
        </Typography>
      }
    </Box>
  )
}