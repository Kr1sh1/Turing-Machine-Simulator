import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import Machine from "../components/Machine";
import LoadExampleDialog from "../components/LoadExampleDialog";
import { useLocation } from "react-router-dom";

export default function Machines() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [defaultMachine, setDefaultMachine] = useState({})
  const [activeMachine, setActiveMachine] = useState({})
  const [exampleDialogOpen, setExampleDialogOpen] = useState(false)
  const [counter, setCounter] = useState(0)
  const [title, setTitle] = useState("")
  const location = useLocation()
  const open = Boolean(anchorEl)

  const itemClicked = (item) => {
    if (item) {
      setCounter(count => count + 1)
      setTitle(item.description)
      setDefaultMachine(item.machine)
    }
    setAnchorEl(null)
    setExampleDialogOpen(false)
  }

  useLayoutEffect(() => {
    if (location.state?.item) itemClicked(location.state.item)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadFile = (event) => {
    const fileReader = new FileReader()
    const file = event.target.files[0]

    fileReader.onload = (event) => {
      const machine = JSON.parse(event.target.result)
      itemClicked({ description: file.name, machine })
    }

    fileReader.readAsText(file)
  }

  const saveFile = () => {
    const machine = JSON.stringify(activeMachine)
    console.log(machine)
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Button
          onClick={(event) => setAnchorEl(event.currentTarget)}
          variant="outlined">
          File
        </Button>
        <Typography sx={{ flexGrow: 1, textAlign: "center" }} variant="h6">{title}</Typography>
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setExampleDialogOpen(true)}>Load an example</MenuItem>

        <input hidden id="file-input" type="file" onChange={loadFile} />
        <label htmlFor="file-input">
          <MenuItem>Load from file</MenuItem>
        </label>

        <MenuItem onClick={saveFile}>Save</MenuItem>
      </Menu>

      <Machine {...defaultMachine} setActiveMachine={setActiveMachine} key={counter} />
      <LoadExampleDialog open={exampleDialogOpen} itemClicked={itemClicked} />
    </>
  )
}