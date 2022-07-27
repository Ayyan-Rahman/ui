import normalizeUrl from 'normalize-url';

import DescriptionIcon from '@mui/icons-material/Description';
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

const SelfVerifyContent = ({ data, completed, updatedAt, completeTask }) => {
  const files = data.files.map((file, index) => {
    return (
      <ListItem
        key={index}
        sx={{ cursor: 'pointer' }}
        onClick={() =>
          window.open(
            normalizeUrl(`${file.link}`, {
              defaultProtocol: 'https:',
            }),
            '_blank'
          )
        }
      >
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary={file.title} secondary={file.description} />
      </ListItem>
    );
  });

  return (
    <List>
      {files}
      {completed ? (
        <Typography color="#c5ffe3" variant="subtitle2">
          Task completed at {updatedAt}
        </Typography>
      ) : (
        <Button
          variant="contained"
          sx={{ marginTop: '15px' }}
          onClick={() => completeTask({})}
        >
          Submit
        </Button>
      )}
    </List>
  );
};

export default SelfVerifyContent;