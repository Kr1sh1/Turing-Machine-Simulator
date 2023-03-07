import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";

export default function StateSelection({ states, selections, setSelections, editorIsLocked }) {
  const handleSelectionChange = (value, type) => {
    let otherTypes = Object.keys(selections).filter(selectionType => selectionType !== type)
    let sameValue = otherTypes.find(selectionType => selections[selectionType] === value)

    if (value !== "" && typeof sameValue !== 'undefined') {
      setSelections({...selections, [type]: value, [sameValue]: ""})
    } else {
      setSelections({...selections, [type]: value})
    }
  }

  return (
    <Grid container direction="column">
      {Object.keys(selections).map(type => (
        <Grid item key={type}>
          <FormControl sx={{ minWidth: "160px", paddingBottom: "20px" }} disabled={editorIsLocked}>
            <InputLabel>{type}</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={selections[type]}
              label={type}
              onChange={event => handleSelectionChange(event.target.value, type)}
            >
              <MenuItem value="">None</MenuItem>
              {states.map(state => (
                <MenuItem value={state} key={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ))}
    </Grid>
  )
}
