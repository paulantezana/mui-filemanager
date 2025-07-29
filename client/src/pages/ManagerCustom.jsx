import FileManager from "../components/FileManager/FileManager";
import FileService from "./services/FileService";
import { Dialog, DialogContent } from "@mui/material";

const fileService = new FileService();

const DescriptionInput = ({ value, onChange, label, ...props }) => (
  <input
    type="text"
    placeholder="Descripción..."
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    style={{ padding: '4px', fontSize: '12px', minWidth: '120px' }}
    {...props}
  />
);

const CategorySelect = ({ value, onChange, label, options = [], ...props }) => (
  <select
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    style={{ padding: '4px', fontSize: '12px' }}
    {...props}
  >
    <option value="">Sin categoría</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const PrioritySelector = ({ value, onChange, label, colors = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <small>{label}</small>
      <div style={{ display: 'flex', gap: '4px' }}>
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: color.color,
              border: value === color.value ? '2px solid black' : '1px solid gray',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
};

const ManagerCustom = ({ onClose }) => {
  const operations = {
    // list: data,
    list: async (path) => {
      return await fileService.tree();
    },
    info: (path) => {

    },
    create: async ({ type, data, path }) => {
      const { file, ...rest } = data;
      console.log({ type, path, file, ...rest }, '_UPLOAD__');
      if (type === 'folder') {
        return await fileService.createFolder(path);
      } else if (type === 'file') {
        return await fileService.uploadFile(file, path);
      }
    },
    update: (path) => {

    },
    delete: async ({ path }) => {
      return await fileService.deletePath(path);
    },
    load: async ({ path }) => {
      return await fileService.downloadFile(path);
    },
  }

  const customComponents = [
    {
      key: 'description',
      label: 'Descripción',
      ComponentEdit: DescriptionInput,
      ComponentRender: ({ value, item }) => <i>{item.description}</i>,
      propsEdit: {
        placeholder: 'Describe el archivo...'
      }
    },
    {
      key: 'category',
      label: 'Categoría',
      ComponentEdit: CategorySelect,
      ComponentRender: ({ value, item }) => <i>{item.category}</i>,
      propsEdit: {
        options: [
          { value: 'document', label: 'Documento' },
          { value: 'image', label: 'Imagen' },
          { value: 'video', label: 'Video' },
          { value: 'other', label: 'Otro' }
        ]
      }
    },
    {
      key: 'priority',
      label: 'Prioridad',
      ComponentEdit: PrioritySelector,
      ComponentRender: ({ value, item }) => <i>{item.priority}</i>,
      propsEdit: {
        colors: [
          { value: 'low', label: 'Baja', color: '#4CAF50' },
          { value: 'medium', label: 'Media', color: '#FF9800' },
          { value: 'high', label: 'Alta', color: '#F44336' }
        ]
      }
    }
  ];

  return (<Dialog
    open
    fullWidth
    maxWidth="lg"
    onClose={onClose}
  >
    <DialogContent sx={{ padding: '.5rem' }} >
      <div style={{ height: 'calc(100vh - 80px)' }}>
        <FileManager
          operations={operations}
          folderModel="client"
          customComponents={customComponents}
        ></FileManager>
      </div>
    </DialogContent>
  </Dialog>);
}

export default ManagerCustom;