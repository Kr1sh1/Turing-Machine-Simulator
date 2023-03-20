import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import LoadExampleDialog from '../components/LoadExampleDialog'

export default function Home() {
  const navigate = useNavigate()
  const [exampleDialogOpen, setExampleDialogOpen] = useState(false)

  const itemClicked = (item) => {
    if (item) {
      navigate("machines", {state: {item}})
    } else {
      setExampleDialogOpen(false)
    }
  }

  const loadFile = (event) => {
    const fileReader = new FileReader()
    const file = event.target.files[0]

    fileReader.onload = (event) => {
      const machine = JSON.parse(event.target.result)
      navigate("machines", { state: {item: {description: file.name, machine }} })
    }

    fileReader.readAsText(file)
  }

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
          onClick={() => setExampleDialogOpen(true)}
        >Load an example</Button>

        <input
          hidden
          id="file-input"
          type="file"
          onChange={loadFile}
        />
        <label htmlFor="file-input">
          <Button variant="contained" component="span" sx={{ right: "0", top: "0" }}>
            Load from file
          </Button>
        </label>

        <Button variant='contained' sx={{
          left: "calc(50% - 75px)",
          bottom: "0"
          }}
          onClick={() => navigate("machines")}
        >Create a Turing Machine</Button>
      </Box>
      <LoadExampleDialog open={exampleDialogOpen} itemClicked={itemClicked} turingMachineActive={false} />
    </Box>
  )
}
