import { useState } from "react";
import ContextMenu from "../../shared/components/ContextMenu";
import { Checkbox } from "@mui/material";
import { useSetSelectedFile } from "../../context/FileSelectionContext";
import FileViewer from "../../shared/components/FileViewer";

const ViewCell = ({ file, onClick, onCheked, onDoubleClick, onContextMenu, checked, loadFile }) => {
  return (
    <div
      className="thumbnail-wrapper"
      onClick={() => onClick(file)}
      onDoubleClick={() => onDoubleClick(file)}
      onContextMenu={(event) => onContextMenu(event, file)}
    >
      <div className="thumbnail-container">
        <Checkbox
          onChange={(event) => onCheked(event, file)}
          size="small"
          className="thumbnail-input"
          checked={checked}
        />
        <div className="thumbnail">
          {file.type === 'folder' && <div className="h-full w-full flex items-center justify-center" style={{ fontSize: '2.5rem' }}>📁</div>}
          {file.type === 'file' && <FileViewer file={file} loadFile={loadFile} cover={true} />}
        </div>
      </div>
      <div className="thumbnail-text">
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>{file.name}</div>
      </div>
    </div>
  );
}

export const FileGridView = ({
  files = [],
  onDoubleClick,
  onClickMenu,
  rowSelectionModel,
  setRowSelectionModel,
  operations,
}) => {
  const setSelectedFile = useSetSelectedFile();
  const [selectedRow, setSelectedRow] = useState();

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    setSelectedRow(file);

    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6,
        }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
        // Other native context menus might behave different.
        // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
        null,
    );

    // Prevent text selection lost after opening the context menu on Safari and Firefox
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      setTimeout(() => {
        selection.addRange(range);
      });
    }
  };

  const handleClose = (key = '') => {
    setContextMenu(null);
    if (key.length > 0) {
      onClickMenu(key, selectedRow);
    }
  };

  const handleCheked = (event, file) => {
    const checked = event.target.checked;
    let ids = [...rowSelectionModel];
    if (checked) {
      if (!ids.includes(file.id)) {
        ids.push(file.id);
      }
    } else {
      ids = ids.filter(id => id !== file.id);
    }
    setRowSelectionModel(ids);
  }

  const loadFile = async (file) => {
    const blob = await operations.load(file);
    return blob;
  }

  const handleClick = (file) => {
    setSelectedFile(file);
  }

  return (<>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '.25rem' }}>
      {files.map((file, index) => (
        <ViewCell
          key={index}
          showDetail={true}
          file={file}
          onCheked={handleCheked}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onDoubleClick={onDoubleClick}
          checked={rowSelectionModel.includes(file.id)}
          loadFile={loadFile}
        />
      ))}
    </div>
    <ContextMenu
      contextMenu={contextMenu}
      onClose={handleClose}
    />
  </>)
}

export default FileGridView;