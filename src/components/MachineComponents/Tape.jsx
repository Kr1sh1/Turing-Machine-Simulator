import { useAutoAnimate } from '@formkit/auto-animate/react'
import NavigationIcon from '@mui/icons-material/Navigation'
import { Box, IconButton, Paper, Tooltip } from '@mui/material'
import { memo, useLayoutEffect, useRef, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { enqueueSnackbar } from 'notistack';

export default memo(function Tape({ configuration, getCenteredSlice }) {
  const [parent] = useAutoAnimate( {
    duration: 250
  } )
  const [tapeWidth, setTapeWidth] = useState(0)
  const container = useRef()

  const copyToClipboard = () => {
    let text = ""
    if (!configuration.tape.backwardTape) {
      text += configuration.tape.forwardTape.slice(1).join("")
    } else {
      text += [...configuration.tape.backwardTape].reverse().join("") + configuration.tape.forwardTape.join("")
    }
    text = text.replaceAll(/^_+|_+$/g, "")
    navigator.clipboard.writeText(text).then(
      () => enqueueSnackbar("Tape contents copied to clipboard", { variant: "success" })
    )
  }
  
  const cellSize = "50px"

  let numCells = Math.floor(tapeWidth / 52)
  if (numCells % 2 === 0) {
    numCells = numCells - 1
  }

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setTapeWidth(entries[0].contentRect.width)
    })
    observer.observe(container.current)

    return () => observer.disconnect()
  }, [])

  const tape = getCenteredSlice(numCells, configuration.headPosition)

  const emptyCells = []
  for (let index = numCells - tape.length; index > 0 ; index--) {
    emptyCells.push(-index)
  }

  const cells = !configuration.tape.backwardTape ?
    (<>
      {emptyCells.map((key) => (
        <Paper variant="outlined" square sx={{ minWidth: cellSize, width: cellSize, height: cellSize, visibility: "hidden" }} key={key} />
      ))}
      {tape.map(cell => (
        <div key={cell.key}>
          {cell.key}
          <Paper variant="outlined" square sx={{ minWidth: cellSize, width: cellSize, height: cellSize, textAlign: "center", lineHeight: "50px" }}>{cell.value}</Paper>
        </div>
      ))}
    </>) :
    tape.map(cell => (
      <div key={cell.key}>
        {cell.key}
        <Paper variant="outlined" square sx={{ minWidth: cellSize, width: cellSize, height: cellSize, textAlign: "center", lineHeight: "50px" }}>{cell.value}</Paper>
      </div>
    ))

  return (
    <Box sx={{ textAlign: "center", alignSelf: "center", width: "100%", position: "relative", height: "100%", display: "flex", alignItems: "center" }} ref={container}>
      <Box sx={{ width: "100%" }}>
        Current State: {configuration.state}
        <br></br><br />
        <Box ref={parent} sx={{ display: "flex", justifyContent: "center" }}>
          {cells}
        </Box>
        <NavigationIcon />
      </Box>
      <Tooltip title="Copy tape contents" placement="bottom">
        <IconButton onClick={copyToClipboard} sx={{ position: "absolute", top: "5px", right: "5px" }}>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
})
