import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

const menuItems = [
  // { key: 'edit', label: 'Modificar', icon: <EditIcon fontSize="small" /> },
  { key: 'delete', label: 'Eliminar', icon: <DeleteIcon fontSize="small" /> },
  { key: 'download', label: 'Descargar', icon: <DownloadIcon fontSize="small" /> },
];

const ContextMenu = ({ contextMenu, onClose }) => {
  return (
    <Menu
      open={contextMenu !== null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
      slotProps={{
        root: {
          onContextMenu: (event) => {
            event.preventDefault();
            onClose();
          },
        },
      }}
    >
      {menuItems.map(({ key, label, icon }) => (
        <MenuItem dense key={key} onClick={() => onClose(key)}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ContextMenu;
