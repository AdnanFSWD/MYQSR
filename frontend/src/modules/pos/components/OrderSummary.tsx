import React from 'react';
import { Box, Typography, TextField, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  onDiscountChange: (value: number) => void;
  discountType: 'PERCENTAGE' | 'FIXED';
  onDiscountTypeChange: (value: 'PERCENTAGE' | 'FIXED') => void;
  gst: number;
  total: number;
  disabled: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount,
  onDiscountChange,
  discountType,
  onDiscountTypeChange,
  gst,
  total,
  disabled,
}) => {
  const handleDiscountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(val) && val >= 0) {
      if (discountType === 'PERCENTAGE') {
        onDiscountChange(Math.min(val, 100));
      } else {
        onDiscountChange(Math.min(val, subtotal));
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Subtotal */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Subtotal
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          ₹{subtotal.toFixed(2)}
        </Typography>
      </Box>

      {/* Discount Selector & Input */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Discount
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ToggleButtonGroup
            value={discountType}
            exclusive
            onChange={(_, val) => val && onDiscountTypeChange(val)}
            size="small"
            sx={{
              height: 28,
              '& .MuiToggleButton-root': {
                px: 1,
                py: 0,
                fontSize: '0.75rem',
                fontWeight: 700,
              },
            }}
          >
            <ToggleButton value="FIXED">₹</ToggleButton>
            <ToggleButton value="PERCENTAGE">%</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            type="number"
            size="small"
            value={discount || ''}
            placeholder="0.00"
            onChange={handleDiscountInputChange}
            disabled={disabled}
            slotProps={{
              htmlInput: {
                min: 0,
                max: discountType === 'PERCENTAGE' ? 100 : subtotal,
                step: discountType === 'PERCENTAGE' ? 1 : 0.5,
                style: { textAlign: 'right', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 700 },
              },
            }}
            sx={{
              width: 80,
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                height: 28,
              },
            }}
          />
        </Box>
      </Box>

      {/* GST */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          GST (5%)
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          ₹{gst.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ my: 0.5 }} />

      {/* Grand Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Total Amount
        </Typography>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 900 }}>
          ₹{total.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};
