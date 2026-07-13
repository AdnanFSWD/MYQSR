import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { MenuCard } from './MenuCard';
import type { MenuItem } from '../../../api/menuItemApi';

interface MenuGridProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  isLoading: boolean;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items, onAddItem, isLoading }) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: 250,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: 250,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
          No menu items found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Try checking other categories or adjusting your search query.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ overflowY: 'auto', maxHeight: '100%', pr: 0.5 }}>
      {items.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
          <MenuCard item={item} onAddItem={onAddItem} />
        </Grid>
      ))}
    </Grid>
  );
};
