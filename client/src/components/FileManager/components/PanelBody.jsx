import FileGridView from "./FileGridView";
import TableView from "./TableView";

const PanelBody = ({
  currentItems,
  onClick,
  onDoubleClick,
  onClickMenu,
  viewMode,
  rowSelectionModel,
  setRowSelectionModel,
  customColumns,
  operations,
}) => {
  return (
    <div className="panel-body">
      {viewMode === 'table' && <TableView
        files={currentItems}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onClickMenu={onClickMenu}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        customColumns={customColumns}
      />}
      {viewMode === 'grid' && <FileGridView
        files={currentItems}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onClickMenu={onClickMenu}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        customColumns={customColumns}
        operations={operations}
      />}
    </div>
  );
};

export default PanelBody;