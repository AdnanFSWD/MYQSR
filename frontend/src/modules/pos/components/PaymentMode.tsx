import React from 'react';
import { FormControl, FormLabel, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

interface PaymentModeProps {
  paymentMode: 'CASH' | 'UPI' | 'CARD';
  onPaymentModeChange: (value: 'CASH' | 'UPI' | 'CARD') => void;
  disabled: boolean;
}

export const PaymentMode: React.FC<PaymentModeProps> = ({
  paymentMode,
  onPaymentModeChange,
  disabled,
}) => {
  return (
    <FormControl component="fieldset" disabled={disabled} sx={{ mt: 1.5, width: '100%' }}>
      <FormLabel component="legend" sx={{ fontSize: '0.75rem', fontWeight: 800, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Payment Mode
      </FormLabel>
      <ToggleButtonGroup
        value={paymentMode}
        exclusive
        onChange={(_, val) => val && onPaymentModeChange(val)}
        size="small"
        fullWidth
        sx={{
          '& .MuiToggleButton-root': {
            py: 0.8,
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'capitalize',
            borderRadius: '8px',
          },
        }}
      >
        <ToggleButton value="CASH">
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Cash</Typography>
        </ToggleButton>
        <ToggleButton value="UPI">
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>UPI</Typography>
        </ToggleButton>
        <ToggleButton value="CARD">
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Card</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
};
