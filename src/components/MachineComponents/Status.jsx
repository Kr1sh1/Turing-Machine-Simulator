import { Box, Typography } from "@mui/material";

export default function Status({ numComputationsDiscovered, numComputationsTerminated, acceptingComputationFound, haltingState }) {
  let color = "grey"
  let subtext = null
  let status = null

  if (haltingState && numComputationsTerminated > 0) {
    color = "blue"
    status = "Terminable"
  } else if (acceptingComputationFound) {
    color = "greenyellow"
    status = "Input Accepted"
    subtext = "Accepting Computation Found"
  } else if (numComputationsDiscovered === numComputationsTerminated) {
    color = "red"
    status = "Input Rejected"
    subtext = "No Accepting Computation Found"
  } else {
    status = "Unknown"
    subtext = `${numComputationsTerminated} of ${numComputationsDiscovered} computations fully explored`
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginTop: "10px", color: "white", borderRadius: "10px", height: "4em", width: "100%", backgroundColor: color, justifyContent: "center", textAlign: "center" }}>
      <Typography variant="h5">
        Status: {status}
      </Typography>
      {subtext &&
        <Typography variant="caption">
          {subtext}
        </Typography>
      }
    </Box>
  )
}
