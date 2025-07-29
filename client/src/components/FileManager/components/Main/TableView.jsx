import { useState } from "react";
import getFileIcon from "../../helpers/fileIcon";

import { DataGridPremium, useGridApiContext } from '@mui/x-data-grid-premium';
import formatFileSize from "../../helpers/formatFileSize";
import ContextMenu from "./ContextMenu";
import { Box } from "@mui/material";
import { useSetSelectedFile } from "../../context/FileSelectionContext";
import { useItemSelectedContext } from "../../context/ItemSelectionContext";
import { useFileManagerContext } from "../../context/FileManagerContext";
import { useSetFullscreenPreviewFile } from "../../context/FullscreenPreviewContext";
import { useRef } from "react";

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

const useCustomColumns = (config) => {
  const { customComponents } = config;

  const RenderCell = ({ item, row }) => {
    if (!item.ComponentRender) return null;

    const value = row[item.key]
    const CustomComponent = item.ComponentRender;

    return (
      <CustomComponent
        value={value}
        item={row}
      />
    );
  };

  const RenderEditCell = ({ item, params }) => {
    const { id, value, field, hasFocus, row } = params;
    const apiRef = useGridApiContext();
    const ref = useRef(null);

    const handleChange = (newValue) => {
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    const CustomComponent = item?.ComponentEdit;

    if (!CustomComponent) return null;

    return (
      <CustomComponent
        ref={ref}
        value={value}
        onChange={handleChange}
        label={item.label}
        {...item.propsEdit}
      />
    );
  };

  return customComponents?.map((item) => ({
    field: item.key,
    headerName: item.label,
    renderCell: ({ value, row }) => <RenderCell item={item} row={row} />,
    // renderEditCell: (params) => <RenderEditCell item={item} params={params} />
  })) ?? [];
}

export const TableView = () => {
  const { manager: { currentItems, refresh }, config } = useFileManagerContext();
  const setSelectedFile = useSetSelectedFile();
  const { rowSelectionModel, setRowSelectionModel } = useItemSelectedContext();
  const setFullscreenFile = useSetFullscreenPreviewFile();

  const [selectedRow, setSelectedRow] = useState();
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();

    const dataId = event.currentTarget.getAttribute('data-id');
    const file = currentItems.find((row) => row.id === dataId);

    setSelectedRow(file);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null,
    );
  };

  const handleClick = (file) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  }

  const customColumns = useCustomColumns(config);

  const fullColumns = [
    ...columns,
    ...customColumns,
  ];

  const onDoubleClick = (file) => {
    setFullscreenFile(file);
  }

  return (<>
    <Box sx={{ width: '100%' }} >
      <DataGridPremium
        density="compact"
        columns={fullColumns}
        rows={currentItems}

        // Layout
        rowHeight={25}
        columnHeaderHeight={32}
        sx={{
          '.MuiDataGrid-footerContainer': {
            minHeight: '25px',
          }
        }}

        onRowDoubleClick={(params) => onDoubleClick(params.row)}
        onRowClick={(params) => handleClick(params.row)}
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
      onClose={() => setContextMenu(null)}
      selectedRow={selectedRow}
    />
  </>)
}

export default TableView;