import React from 'react';
import { Box, Typography } from '@mui/material';
import { CartItem } from './CartItem';

interface CartItemData {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
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
          minHeight: 180,
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, opacity: 0.5 }}>
          🛒
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          No items added to order
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 350px)', // Increased vertical space to fit more items
        pr: 0.5,
        display: 'flex',
        flexDirection: 'column',
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
