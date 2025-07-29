import { useState } from "react";
import ContextMenu from "./ContextMenu";
import { Checkbox } from "@mui/material";
import { useSetSelectedFile } from "../../context/FileSelectionContext";
import FileViewer from "../../shared/components/FileViewer";
import { useItemSelectedContext } from "../../context/ItemSelectionContext";
import { useFileManagerContext } from "../../context/FileManagerContext";
import useFileOperation from "../../hooks/useFileOperation";
import { useSetFullscreenPreviewFile } from "../../context/FullscreenPreviewContext";

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

export const FileGridView = () => {
  // Global states
  const { rowSelectionModel, setRowSelectionModel } = useItemSelectedContext();
  const { manager: { currentItems } } = useFileManagerContext();
  const setSelectedFile = useSetSelectedFile();
  const { loadFile } = useFileOperation()
  const setFullscreenFile = useSetFullscreenPreviewFile();

  // Local states
  const [selectedRow, setSelectedRow] = useState();
  const [contextMenu, setContextMenu] = useState(null);

  // Cell actions
  const handleClick = (file) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  }

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

  const onDoubleClick = (file) => {
    setFullscreenFile(file);
  }

  // Context menu options
  const handleContextMenuOpen = (event, file) => {
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

  return (<>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '.25rem' }}>
      {currentItems.map((file, index) => (
        <ViewCell
          key={index}
          file={file}
          onClick={handleClick}
          onCheked={handleCheked}
          onContextMenu={handleContextMenuOpen}
          onDoubleClick={onDoubleClick}
          checked={rowSelectionModel.includes(file.id)}
          loadFile={loadFile}
        />
      ))}
    </div>
    <ContextMenu
      contextMenu={contextMenu}
      onClose={() => setContextMenu(null)}
      selectedRow={selectedRow}
    />
  </>)
}

export default FileGridView;