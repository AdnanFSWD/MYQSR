import React from 'react';
import { Paper, List, ListItem, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import type { Category } from '../../api/categoryApi';

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
  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1F2937' : '#F8FAFC' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Categories
        </Typography>
      </Box>
      <List sx={{ overflowY: 'auto', p: 1, flexGrow: 1 }}>
        {/* All Categories */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={selectedCategoryId === 'All'}
            onClick={() => onSelectCategory('All')}
            sx={{
              borderRadius: '8px',
              py: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: selectedCategoryId === 'All' ? 700 : 500, fontSize: '0.9rem' }}>
                  All Categories
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>

        {/* Dynamic Categories */}
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <ListItem key={category.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => onSelectCategory(category.id)}
                sx={{
                  borderRadius: '8px',
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.9rem' }}>
                      {category.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
