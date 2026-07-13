import React from 'react';
import { Box, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Divider } from '@mui/material';

interface SummaryProps {
  subtotal: number;
  discount: number;
  onDiscountChange: (value: number) => void;
  gst: number;
  total: number;
  paymentMode: 'CASH' | 'UPI' | 'CARD';
  onPaymentModeChange: (value: 'CASH' | 'UPI' | 'CARD') => void;
  onCheckout: () => void;
  isCartEmpty: boolean;
}

export const Summary: React.FC<SummaryProps> = ({
  subtotal,
  discount,
  onDiscountChange,
  gst,
  total,
  paymentMode,
  onPaymentModeChange,
  onCheckout,
  isCartEmpty,
}) => {
  const handleDiscountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(val) && val >= 0) {
      // Prevent discount from exceeding subtotal
      onDiscountChange(Math.min(val, subtotal));
    }
  };

  return (
    <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Divider />

      {/* Pricing Breakdown */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ${subtotal.toFixed(2)}
          </Typography>
        </Box>

        {/* Discount Input */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Discount ($)
          </Typography>
          <TextField
            type="number"
            size="small"
            value={discount || ''}
            placeholder="0.00"
            onChange={handleDiscountInputChange}
            disabled={isCartEmpty}
            slotProps={{
              htmlInput: {
                min: 0,
                max: subtotal,
                step: 0.5,
                style: { textAlign: 'right', padding: '6px 10px', fontSize: '0.875rem' },
              },
            }}
            sx={{
              width: 100,
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            GST (5%)
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ${gst.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Grand Total
          </Typography>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
            ${total.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Payment Mode Selection */}
      <FormControl component="fieldset" disabled={isCartEmpty} sx={{ mt: 1 }}>
        <FormLabel component="legend" sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}>
          Payment Mode
        </FormLabel>
        <RadioGroup
          row
          value={paymentMode}
          onChange={(e) => onPaymentModeChange(e.target.value as 'CASH' | 'UPI' | 'CARD')}
        >
          <FormControlLabel
            value="CASH"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Cash</Typography>}
            sx={{ mr: 2 }}
          />
          <FormControlLabel
            value="UPI"
            control={<Radio size="small" />}
            label={<Typography variant="body2">UPI</Typography>}
            sx={{ mr: 2 }}
          />
          <FormControlLabel
            value="CARD"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Card</Typography>}
          />
        </RadioGroup>
      </FormControl>

      {/* Checkout Action Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={isCartEmpty}
        onClick={onCheckout}
        sx={{
          py: 1.5,
          borderRadius: '10px',
          fontWeight: 700,
          boxShadow: 'none',
        }}
      >
        Complete Order
      </Button>
    </Box>
  );
};
