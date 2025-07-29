import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import useFileOperation from '../../hooks/useFileOperation';
import { useFileManagerContext } from '../../context/FileManagerContext';

const menuItems = [
  // { key: 'edit', label: 'Modificar', icon: <EditIcon fontSize="small" /> },
  { key: 'delete', label: 'Eliminar', icon: <DeleteIcon fontSize="small" /> },
  { key: 'download', label: 'Descargar', icon: <DownloadIcon fontSize="small" /> },
];

const ContextMenu = ({ contextMenu, onClose, selectedRow }) => {
  const { manager: { refresh } } = useFileManagerContext();
  const { deleteFile, dowloandFile } = useFileOperation();

  const handleItemClick = async (key = '') => {
    if (!(key.length > 0)) {
      onClose();
      return;
    }

    if (key === 'delete') {
      await deleteFile(selectedRow);
      refresh();
    }

    if (key === 'download') {
      await dowloandFile(selectedRow);
    }

    onClose();
  };

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
        <MenuItem dense key={key} onClick={() => handleItemClick(key)}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ContextMenu;
