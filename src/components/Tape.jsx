import { useAutoAnimate } from '@formkit/auto-animate/react'
import NavigationIcon from '@mui/icons-material/Navigation'
import { Box, Paper } from '@mui/material'
import { useLayoutEffect, useRef, useState } from 'react'
import { OneWayInfiniteTape } from '../Tape'

export default function Tape({ configuration }) {
  const [parent] = useAutoAnimate( {
    duration: 250
  } )
  const [tapeWidth, setTapeWidth] = useState(0)
  const container = useRef()
  
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

  const tape = configuration.tape.getCenteredSlice(numCells, configuration.headPosition)

  const emptyCells = []
  for (let index = numCells - tape.length; index > 0 ; index--) {
    emptyCells.push(-index)
  }

  const cells = configuration.tape instanceof OneWayInfiniteTape ?
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
    <Box sx={{ textAlign: "center", flexGrow: "1", alignSelf: "center", minWidth: "0" }} ref={container}>
      Current State: {configuration.state}
      <br></br><br />
      <Box ref={parent} sx={{ display: "flex", justifyContent: "center" }}>
        {cells}
      </Box>
      <NavigationIcon />
    </Box>
  )
}
