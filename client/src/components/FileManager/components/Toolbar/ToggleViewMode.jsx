import GridOnIcon from '@mui/icons-material/GridOn';
import TableChartIcon from '@mui/icons-material/TableChart';
import { IconButton } from '@mui/material';

export default function ToggleViewMode({ setViewMode, viewMode }) {
  return (
    <div className='flex gap-1'>
      <IconButton type='button' aria-label="Tabla" size="small" onClick={() => setViewMode('table')}>
        <TableChartIcon fontSize="inherit" />
      </IconButton>
      <IconButton type='button' aria-label="Grilla" size="small" onClick={() => setViewMode('grid')}>
        <GridOnIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
}