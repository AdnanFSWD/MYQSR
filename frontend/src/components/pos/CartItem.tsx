import React from 'react';
import { Box, Typography, IconButton, ButtonGroup } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface CartItemData {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const itemTotal = item.price * item.quantity;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ flexGrow: 1, pr: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, lineClamp: 2 }}>
          {item.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ${item.price.toFixed(2)} each
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Quantity Controls */}
        <ButtonGroup size="small" variant="outlined">
          <IconButton size="small" onClick={onDecrease} color="primary" sx={{ p: 0.5 }}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1.5,
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {item.quantity}
          </Box>
          <IconButton size="small" onClick={onIncrease} color="primary" sx={{ p: 0.5 }}>
            <AddIcon fontSize="small" />
          </IconButton>
        </ButtonGroup>

        {/* Line Item Total */}
        <Typography variant="body2" sx={{ fontWeight: 800, width: 60, textAlign: 'right' }}>
          ${itemTotal.toFixed(2)}
        </Typography>

        {/* Remove Button */}
        <IconButton size="small" color="error" onClick={onRemove}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};
