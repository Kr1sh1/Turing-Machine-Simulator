import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Machine from "../components/Machine";
import LoadExampleDialog from "../components/LoadExampleDialog";
import { useLocation } from "react-router-dom";

export default function Machines() {
  const [anchorEl, setAnchorEl] = useState(null)
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
      setActiveMachine(item.machine)
    }
    setAnchorEl(null)
    setExampleDialogOpen(false)
  }

  useEffect(() => {
    if (location.state) {
      itemClicked(location.state)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadFile = () => {}
  const saveFile = () => {}

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
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setExampleDialogOpen(true)}>Load an example</MenuItem>
        <MenuItem onClick={loadFile}>Load from file</MenuItem>
        <MenuItem onClick={saveFile}>Save</MenuItem>
      </Menu>
      <Machine {...activeMachine} key={counter} />
      <LoadExampleDialog open={exampleDialogOpen} itemClicked={itemClicked} />
    </>
  )
}