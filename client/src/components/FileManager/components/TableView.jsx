import { useState } from "react";
import getFileIcon from "../helpers/fileIcon";

import { DataGridPremium } from '@mui/x-data-grid-premium';
import formatFileSize from "../helpers/formatFileSize";
import ContextMenu from "./ContextMenu";
import { Box } from "@mui/material";

const columns = [
  {
    field: 'name',
    headerName: 'Nombre',
    renderCell: ({ value, row }) => {
      return (<>
        {getFileIcon(row.type, row.name)}
        {value}
      </>)
    },
  },
  {
    field: 'type',
    headerName: 'Tipo',
  },
  {
    field: 'size',
    headerName: 'Tamaño',
    renderCell: ({ value }) => formatFileSize(value),
  },
];

export const TableView = ({
  files = [],
  onClick,
  onDoubleClick,
  onClickMenu,
  rowSelectionModel,
  setRowSelectionModel,
}) => {
  const [selectedRow, setSelectedRow] = useState();

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedRow(Number(event.currentTarget.getAttribute('data-id')));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null,
    );
  };

  const handleClose = (key = '') => {
    setContextMenu(null);
    if (key.length > 0) {
      const file = files.find((row) => row.id === selectedRow);
      onClickMenu(key, file);
    }
  };

  return (<>
    <Box sx={{ width: '100%' }} >
      <DataGridPremium
        density="compact"
        columns={columns}
        rows={files}

        onRowDoubleClick={(params) => onDoubleClick(params.row)}
        onRowClick={(params) => onClick(params.row)}
        slotProps={{
          row: {
            onContextMenu: handleContextMenu,
            style: { cursor: 'context-menu' },
          },
        }}

        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
      />
    </Box>
    <ContextMenu
      contextMenu={contextMenu}
      onClose={handleClose}
    />
  </>)
}

export default TableView;