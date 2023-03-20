import { Box, Button } from '@mui/material'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box sx={{ alignSelf: "center", display: "flex",
               flexDirection: "column", width: "100%",
               height: "100%", textAlign: "center",
               justifyContent: "center", borderRadius: "10px",
               backgroundColor: "brown" }}>


      <Box className="title" sx={{ color: "white" }}>
        <h1>Turing Machine Simulator</h1>
      </Box>

      <Box className="homeButtons" sx={{ position: "relative", width: "325px", height: "300px", margin: "0 auto" }}>
        <Button variant='contained' sx={{
          left: "0",
          top: "0",
          }}
          onClick={() => navigate("somewhere")}
        >Load an example</Button>

        <Button variant='contained' sx={{
          right: "0",
          top: "0",
          }}
          onClick={() => navigate("somewhere")}
        >Load a file</Button>

        <Button variant='contained' sx={{
          left: "calc(50% - 75px)",
          bottom: "0"
          }}
          onClick={() => navigate("machines")}
        >Create a Turing Machine</Button>
      </Box>
    </Box>
  )
}
