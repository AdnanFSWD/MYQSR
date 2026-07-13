import React from 'react';
import { Grid, Card, CardContent, CardActionArea, Box, Typography, CircularProgress } from '@mui/material';
import type { MenuItem } from '../../api/menuItemApi';

interface MenuGridProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  isLoading: boolean;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items, onAddItem, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200, p: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          No menu items available in this category.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ overflowY: 'auto', maxHeight: '100%', pr: 0.5 }}>
      {items.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
          <Card
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 6px 12px -2px rgba(0, 0, 0, 0.4)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <CardActionArea onClick={() => onAddItem(item)}>
              {/* Image Container */}
              <Box
                sx={{
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1F2937' : '#F1F5F9',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={`/images/menu/${item.image}`}
                  alt={item.name}
                  sx={{
                    width: 70,
                    height: 70,
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    height: 34,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.name}
                </Typography>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mt: 1 }}>
                  ${Number(item.price).toFixed(2)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
