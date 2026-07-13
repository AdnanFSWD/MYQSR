import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import type { SettingsData } from '../../../api/settingsApi';

interface BillingSettingsProps {
  initialData: SettingsData;
  onSubmit: (data: Partial<SettingsData>) => void;
  loading: boolean;
}

export const BillingSettings: React.FC<BillingSettingsProps> = ({
  initialData,
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SettingsData>({
    defaultValues: initialData,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
        Billing Preferences
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="GST Percentage (%)"
            type="number"
            fullWidth
            required
            error={!!errors.gstPercentage}
            helperText={errors.gstPercentage?.message}
            {...register('gstPercentage', {
              required: 'GST Percentage is required',
              min: { value: 0, message: 'GST cannot be negative' },
              max: { value: 100, message: 'GST cannot exceed 100%' },
              valueAsNumber: true,
            })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Currency Symbol / Code"
            fullWidth
            required
            error={!!errors.currency}
            helperText={errors.currency?.message}
            {...register('currency', { required: 'Currency description is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="default-payment-label">Default Payment Mode</InputLabel>
            <Controller
              name="defaultPaymentMode"
              control={control}
              rules={{ required: 'Default Payment Mode is required' }}
              render={({ field }) => (
                <Select
                  labelId="default-payment-label"
                  label="Default Payment Mode"
                  {...field}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="CARD">Card</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Controller
            name="roundOffBills"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Enable Bill Rounding (decimals round to nearest whole integer)
                  </Typography>
                }
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={{ borderRadius: '8px', py: 1.2, px: 3, fontWeight: 700, boxShadow: 'none' }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};
