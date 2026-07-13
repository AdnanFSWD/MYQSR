import React from 'react';
import { Paper, List, ListItem, ListItemButton, Typography, Box, useTheme } from '@mui/material';
import type { Category } from '../../../api/categoryApi';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: number | 'All';
  onSelectCategory: (id: number | 'All') => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <Box sx={{ p: 1.5, bgcolor: isDarkMode ? '#1F2937' : '#F8FAFC', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Categories
        </Typography>
      </Box>
      <List sx={{ overflowY: 'auto', p: 0.5, flexGrow: 1 }}>
        {/* All Categories */}
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedCategoryId === 'All'}
            onClick={() => onSelectCategory('All')}
            sx={{
              borderRadius: '6px',
              py: 0.8,
              px: 1.5,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: selectedCategoryId === 'All' ? 700 : 500, fontSize: '0.85rem' }}>
              All Items
            </Typography>
          </ListItemButton>
        </ListItem>

        {/* Dynamic Categories */}
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <ListItem key={category.id} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => onSelectCategory(category.id)}
                sx={{
                  borderRadius: '6px',
                  py: 0.8,
                  px: 1.5,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.85rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {category.name}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
