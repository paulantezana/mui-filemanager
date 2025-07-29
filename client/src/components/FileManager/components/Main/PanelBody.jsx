import { useDisplayMode } from "../../context/DisplayModeContext";
import FileGridView from "./FileGridView";
import TableView from "./TableView";

const PanelBody = () => {

  const display = useDisplayMode();

  return (
    <div className="panel-body">
      {display === 'table' && <TableView />}
      {display === 'grid' && <FileGridView />}
    </div>
  );
};

export default PanelBody;