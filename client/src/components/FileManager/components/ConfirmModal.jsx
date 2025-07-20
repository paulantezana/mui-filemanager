import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmModal = ({ title, description }) => {
  const handleClose = () => {

  }

  return (<Dialog
    open
    onClose={handleClose}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>NO</Button>
      <Button onClick={handleClose}>SI</Button>
    </DialogActions>
  </Dialog>)
}

export default ConfirmModal;