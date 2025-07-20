import FileGridView from "./FileGridView";
import TableView from "./TableView";

const PanelBody = ({
  currentItems, onClick, onDoubleClick, onClickMenu, viewMode,
  rowSelectionModel,
  setRowSelectionModel,
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
      />}
      {viewMode === 'grid' && <FileGridView
        files={currentItems}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onClickMenu={onClickMenu}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
      />}
    </div>
  );
};

export default PanelBody;