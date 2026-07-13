import React from 'react';
import { Box, Typography } from '@mui/material';

export const POSHeader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        pb: 1,
        mb: 1.5,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
        {' | '}
        {new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Typography>
    </Box>
  );
};
