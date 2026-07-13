import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

interface OrderTypeProps {
  orderType: 'DINE_IN' | 'TAKE_AWAY';
  onOrderTypeChange: (value: 'DINE_IN' | 'TAKE_AWAY') => void;
}

export const OrderType: React.FC<OrderTypeProps> = ({ orderType, onOrderTypeChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs
        value={orderType}
        onChange={(_, val) => onOrderTypeChange(val)}
        variant="fullWidth"
        sx={{
          minHeight: 36,
          '& .MuiTab-root': {
            py: 1,
            minHeight: 36,
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'none',
          },
        }}
      >
        <Tab label="Dine In" value="DINE_IN" />
        <Tab label="Take Away" value="TAKE_AWAY" />
      </Tabs>
    </Box>
  );
};
