import GridOnIcon from '@mui/icons-material/GridOn';
import TableChartIcon from '@mui/icons-material/TableChart';
import { IconButton } from '@mui/material';

export default function ToggleViewMode({ setViewMode, viewMode }) {
  return (
    <div className='flex gap-1'>
      <IconButton aria-label="Tabla" size="small" onClick={() => setViewMode('table')}>
        <TableChartIcon fontSize="inherit" />
      </IconButton>
      <IconButton aria-label="Grilla" size="small" onClick={() => setViewMode('grid')}>
        <GridOnIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
}