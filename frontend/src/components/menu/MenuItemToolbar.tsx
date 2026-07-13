import React from 'react';
import { Box, TextField, Button, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';

interface MenuItemToolbarProps {
  onAddClick: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  availabilityFilter: string;
  onAvailabilityFilterChange: (value: string) => void;
  categories: string[];
}

export const MenuItemToolbar: React.FC<MenuItemToolbarProps> = ({
  onAddClick,
  searchValue,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  categories,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          flexGrow: 1,
        }}
      >
        {/* Search Input */}
        <TextField
          placeholder="Search Menu Item..."
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 260 },
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

        {/* Category Filter */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 } }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryFilter}
            label="Category"
            onChange={(e: SelectChangeEvent) => onCategoryFilterChange(e.target.value)}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="All">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Availability Filter */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 } }}>
          <InputLabel id="availability-filter-label">Availability</InputLabel>
          <Select
            labelId="availability-filter-label"
            value={availabilityFilter}
            label="Availability"
            onChange={(e: SelectChangeEvent) => onAvailabilityFilterChange(e.target.value)}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Unavailable">Unavailable</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Add Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddClick}
        sx={{
          borderRadius: '8px',
          px: 3,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          alignSelf: { xs: 'stretch', md: 'auto' },
        }}
      >
        Add Menu Item
      </Button>
    </Box>
  );
};
