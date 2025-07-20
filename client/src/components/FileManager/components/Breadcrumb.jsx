import { Breadcrumbs, Link, Typography } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

const Breadcrumb = ({ pathHistory, onNavigate }) => {
  return (
    <Breadcrumbs 
      separator={<NavigateNext fontSize="small" />}
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
            onClick={() => onNavigate(index)}
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