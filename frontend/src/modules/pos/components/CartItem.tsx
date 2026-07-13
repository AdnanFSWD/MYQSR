import React from 'react';
import { Box, Typography, IconButton, ButtonGroup, useTheme } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface CartItemData {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const itemTotal = item.price * item.quantity;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        gap: 1.5,
      }}
    >
      {/* Item Image */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '8px',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={`/images/menu/${item.image}`}
          alt={item.name}
          sx={{ width: '80%', height: '80%', objectFit: 'contain' }}
        />
      </Box>

      {/* Item Name & Unit Price */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.85rem',
          }}
        >
          {item.name} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}> (₹{Math.round(item.price)})</Box>
        </Typography>
      </Box>

      {/* Quantity & Actions Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        {/* Quantity control button group */}
        <ButtonGroup size="small" variant="outlined">
          <IconButton
            size="small"
            onClick={onDecrease}
            color="primary"
            sx={{ p: 0.3, borderRadius: '4px' }}
          >
            <RemoveIcon fontSize="small" style={{ fontSize: '0.9rem' }} />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1,
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            {item.quantity}
          </Box>
          <IconButton
            size="small"
            onClick={onIncrease}
            color="primary"
            sx={{ p: 0.3, borderRadius: '4px' }}
          >
            <AddIcon fontSize="small" style={{ fontSize: '0.9rem' }} />
          </IconButton>
        </ButtonGroup>

        {/* Item Total Price */}
        <Typography variant="body2" sx={{ fontWeight: 800, width: 56, textAlign: 'right', fontSize: '0.85rem' }}>
          ₹{itemTotal.toFixed(2)}
        </Typography>

        {/* Delete Row Button */}
        <IconButton size="small" color="error" onClick={onRemove} sx={{ p: 0.3 }}>
          <DeleteIcon fontSize="small" style={{ fontSize: '1rem' }} />
        </IconButton>
      </Box>
    </Box>
  );
};
