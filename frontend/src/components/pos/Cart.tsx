import React from 'react';
import { Box, Typography } from '@mui/material';
import { CartItem } from './CartItem';

interface CartItemData {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItemData[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  if (items.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, opacity: 0.5 }}>
          🛒
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Your shopping cart is empty
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        pr: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      {items.map((item) => (
        <CartItem
          key={item.menuItemId}
          item={item}
          onIncrease={() => onIncrease(item.menuItemId)}
          onDecrease={() => onDecrease(item.menuItemId)}
          onRemove={() => onRemove(item.menuItemId)}
        />
      ))}
    </Box>
  );
};
