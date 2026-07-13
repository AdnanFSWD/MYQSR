import React from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';

interface CategoryToolbarProps {
  onAddClick: () => void;
  onSearchChange: (search: string) => void;
  searchValue: string;
}

export const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  onAddClick,
  onSearchChange,
  searchValue,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        mb: 3,
      }}
    >
      <TextField
        placeholder="Search Category..."
        variant="outlined"
        size="small"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          width: { xs: '100%', sm: 300 },
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddClick}
        sx={{
          borderRadius: '8px',
          px: 3,
          fontWeight: 600,
        }}
      >
        Add Category
      </Button>
    </Box>
  );
};
