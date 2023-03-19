import { FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { StateType } from "../Enums";

export default function StateSelection({ states, selections, setSelections, haltingState, editorIsLocked }) {
  const handleSelectionChange = (value, type) => {
    let otherTypes = Object.keys(selections).filter(selectionType => selectionType !== type)
    let sameValue = otherTypes.find(selectionType => selections[selectionType] === value)

    if (value !== "" && typeof sameValue !== 'undefined') {
      setSelections({...selections, [type]: value, [sameValue]: ""})
    } else {
      setSelections({...selections, [type]: value})
    }
  }

  const selectionFilter = (selectionKeys) => {
    if (haltingState) return selectionKeys.filter(key => (key !== StateType.ACCEPT) && (key !== StateType.REJECT))
    return selectionKeys.filter(key => key !== StateType.HALT)
  }

  return (
    <Stack spacing={2} minWidth="160px">
      {selectionFilter(Object.keys(selections)).map(type => (
        <FormControl disabled={editorIsLocked} key={type}>
          <InputLabel>{type}</InputLabel>
          <Select
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
      ))}
    </Stack>
  )
}
