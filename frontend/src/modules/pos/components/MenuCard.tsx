import React from 'react';
import { Card, CardContent, CardActionArea, Box, Typography, Chip, useTheme } from '@mui/material';
import type { MenuItem } from '../../../api/menuItemApi';

interface MenuCardProps {
  item: MenuItem;
  onAddItem: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddItem }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isAvailable = item.isAvailable;

  return (
    <Card
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        opacity: isAvailable ? 1 : 0.6,
        backgroundColor: isAvailable
          ? (isDarkMode ? '#1E293B' : '#FFFFFF')
          : (isDarkMode ? '#0F172A' : '#F1F5F9'),
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': isAvailable
          ? {
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 8px 16px -2px rgba(0, 0, 0, 0.5)'
                : '0 4px 10px -1px rgba(0, 0, 0, 0.08)',
              borderColor: theme.palette.primary.main,
            }
          : {},
      }}
    >
      <CardActionArea
        onClick={() => isAvailable && onAddItem(item)}
        disabled={!isAvailable}
        sx={{ height: '100%' }}
      >
        {/* Image / Thumbnail Container */}
        <Box
          sx={{
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? '#111827' : '#F8FAFC',
            position: 'relative',
            borderBottom: `1px solid ${theme.palette.divider}`,
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
              filter: isAvailable ? 'none' : 'grayscale(100%)',
            }}
          />

          {/* Availability Status Tag */}
          {!isAvailable && (
            <Chip
              label="Unavailable"
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>

        {/* Content Details */}
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.25,
              height: 36,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {item.name}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800 }}>
              ₹{Number(item.price).toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
