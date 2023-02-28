import { Button } from '@mui/material'

export default function Home() {
  return (
    <>
    <div className="title">
      <h1>Turing Machine Simulator</h1>
    </div>
    <div className="buttons">
      <Button variant='contained' sx={{
        aspectRatio: "1 / 1",
        width: "150px",
        borderRadius: "50%"
        }}
      >Load a Turing Machine</Button>
      <Button variant='contained' sx={{
        aspectRatio: "1 / 1",
        width: "150px",
        borderRadius: "50%"
        }}
      >Create a Turing Machine</Button>
    </div>
    </>
  )
}
