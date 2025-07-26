import { Breadcrumbs, Link, Typography } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { useFileManagerContext } from '../context/FileManagerContext';

const Breadcrumb = () => {
  const { manager } = useFileManagerContext();
  const { pathHistory, setPathHistory } = manager;

  const navigateToPath = (index) => {
    const newPath = pathHistory.slice(0, index + 1);

    setPathHistory(newPath);
    // setSelectedItem(null);
  };

  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      sx={{ position: 'static' }}
    >
      {pathHistory.map((path, index) => {
        const isLast = index === pathHistory.length - 1;

        if (isLast) {
          return (
            <Typography key={index} color="text.primary" fontWeight="bold">
              {path.name}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            component="button"
            variant="body1"
            onClick={() => navigateToPath(index)}
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {path.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;