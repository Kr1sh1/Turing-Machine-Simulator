import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
    <Box className="title">
      <h1>Turing Machine Simulator</h1>
    </Box>

    <Box className="buttons">
      <Button variant='contained' sx={{
        aspectRatio: "1 / 1",
        width: "150px",
        borderRadius: "50%"
        }}
        onClick={() => navigate("somewhere")}
      >Load a Turing Machine</Button>

      <Button variant='contained' sx={{
        aspectRatio: "1 / 1",
        width: "150px",
        borderRadius: "50%"
        }}
        onClick={() => navigate("machines")}
      >Create a Turing Machine</Button>
    </Box>
    </>
  )
}
