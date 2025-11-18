import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Construction } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  
  // Get page name from path
  const getPageName = (pathname: string) => {
    const path = pathname.replace('/', '');
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          borderRadius: 3,
        }}
      >
        <Construction 
          sx={{ 
            fontSize: 80, 
            color: 'text.secondary', 
            mb: 3 
          }} 
        />
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mb: 2
          }}
        >
          {getPageName(location.pathname)} Page
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            mb: 3,
            lineHeight: 1.6
          }}
        >
          This page is currently under development. 
          The functionality will be available soon.
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            fontStyle: 'italic'
          }}
        >
          Path: {location.pathname}
        </Typography>
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;