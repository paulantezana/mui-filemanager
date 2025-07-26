import GridOnIcon from '@mui/icons-material/GridOn';
import TableChartIcon from '@mui/icons-material/TableChart';
import { IconButton } from '@mui/material';
import { useDisplayMode, useSetDisplayMode } from '../../context/DisplayModeContext';

export default function ToggleViewMode() {
  const display = useDisplayMode();
  const setDisplay = useSetDisplayMode();

  const handleMode = (mode)=> {
    setDisplay(mode);
  }

  return (
    <div className='flex gap-1'>
      <IconButton type='button' aria-label="Tabla" size="small" onClick={() => handleMode('table')}>
        <TableChartIcon fontSize="inherit" />
      </IconButton>
      <IconButton type='button' aria-label="Grilla" size="small" onClick={() => handleMode('grid')}>
        <GridOnIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
}