import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { examples } from '../ExampleMachines';
import { Typography } from '@mui/material';

export default function LoadExampleDialog({ open, itemClicked, turingMachineActive = true }) {
  return (
    <Dialog onClose={() => itemClicked(null)} open={open}>
      <DialogTitle>Choose an example Turing machine</DialogTitle>
      <List sx={{ pt: 0 }}>
        {examples.map((example, index) => (
          <ListItem sx={{ backgroundColor: "grey" }} key={index}>
            <ListItemButton onClick={() => itemClicked(example)}>
              <ListItemText primary={example.description} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {turingMachineActive &&
      <Typography variant="body" textAlign="center" alignSelf="center" maxWidth="300px" >
        Choosing an example will overwrite the current Turing machine. Make sure to save it first!
      </Typography>
      }
    </Dialog>
  );
}
