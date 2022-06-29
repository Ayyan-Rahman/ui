import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function HoldersModal({ holders, open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Holders
          </Typography>
          <List>
            {holders?.map(({ target }, index) => {
              const { name, pfp, username } = target;
              const alt = `${name} ${username}`;

              return (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar alt={alt} src={pfp} />
                  </ListItemAvatar>
                  <ListItemText primary={name} secondary={username} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Box>
    </Modal>
  );
}
