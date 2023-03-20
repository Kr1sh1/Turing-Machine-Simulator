import { Box, Typography } from "@mui/material";
import { SimulatorState, StateType } from "../../Enums";

export default function Status({ simulatorStatus, currentState, selections, haltingState }) {
  let color = "grey"
  let subtext = null

  if (simulatorStatus === SimulatorState.TERMINATED) {
    if (haltingState) color = "blue"
    else switch (currentState) {
      case selections[StateType.ACCEPT]:
        color = "greenyellow"
        subtext = "Input Accepted"
        break;

      default:
        color = "red"
        subtext = "Input Rejected"
        break;
    }
  }

  return (
    <Box className={simulatorStatus} sx={{ display: "flex", flexDirection: "column", marginTop: "10px", color: "white", borderRadius: "10px", height: "4em", width: "100%", backgroundColor: color, justifyContent: "center", textAlign: "center" }}>
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