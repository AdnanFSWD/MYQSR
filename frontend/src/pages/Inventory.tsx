import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Chip } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface InventoryItemMock {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minimumQuantity: number;
}

export const Inventory: React.FC = () => {
  const mockInventory: InventoryItemMock[] = [
    { id: '1', name: 'Burger Buns', unit: 'pcs', quantity: 150, minimumQuantity: 50 },
    { id: '2', name: 'Cheese Slices', unit: 'pcs', quantity: 200, minimumQuantity: 80 },
    { id: '3', name: 'Chicken Patties', unit: 'pcs', quantity: 30, minimumQuantity: 60 }, // Low stock!
    { id: '4', name: 'Potato Fries Bag (1kg)', unit: 'bags', quantity: 45, minimumQuantity: 15 },
    { id: '5', name: 'Cola Syrup Keg', unit: 'kegs', quantity: 2, minimumQuantity: 3 }, // Low stock!
    { id: '6', name: 'Vanilla Ice Cream tub', unit: 'tubs', quantity: 12, minimumQuantity: 5 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Inventory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor raw materials, ingredients, and stock thresholds.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            Reorder List
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Add Item
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ingredient Name</TableCell>
              <TableCell align="center">Unit</TableCell>
              <TableCell align="center">Current Stock</TableCell>
              <TableCell align="center">Min Requirement</TableCell>
              <TableCell align="center" sx={{ width: '200px' }}>Stock Level</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockInventory.map((row) => {
              const percentage = Math.min((row.quantity / (row.minimumQuantity * 2)) * 100, 100);
              const isLowStock = row.quantity < row.minimumQuantity;

              return (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                  <TableCell align="center">{row.unit}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: isLowStock ? 'error.main' : 'text.primary' }}>
                    {row.quantity}
                  </TableCell>
                  <TableCell align="center">{row.minimumQuantity}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={isLowStock ? 'error' : percentage < 80 ? 'warning' : 'success'}
                        sx={{ width: '100%', height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={isLowStock ? 'Low Stock' : 'Good'}
                      color={isLowStock ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="text" sx={{ mr: 1 }}>Restock</Button>
                    <Button size="small" variant="text" color="error">Edit</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
