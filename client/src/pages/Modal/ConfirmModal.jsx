// ConfirmModal.jsx
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmModal = ({ title, description, onClose, type = 'confirm' }) => {
  const getColor = () => {
    switch (type) {
      case 'success':
        return 'green';
      case 'warning':
        return 'orange';
      default:
        return 'blue';
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle style={{ color: getColor() }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>NO</Button>
        <Button onClick={onClose} color="primary">SI</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
