import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Grid, CircularProgress, Typography } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import type { SettingsData } from '../../../api/settingsApi';

interface RestaurantSettingsProps {
  initialData: SettingsData;
  onSubmit: (data: Partial<SettingsData>) => void;
  loading: boolean;
}

export const RestaurantSettings: React.FC<RestaurantSettingsProps> = ({
  initialData,
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsData>({
    defaultValues: initialData,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
        Restaurant Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Restaurant Name"
            fullWidth
            required
            error={!!errors.restaurantName}
            helperText={errors.restaurantName?.message}
            {...register('restaurantName', { required: 'Restaurant Name is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            fullWidth
            required
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register('phone', { required: 'Phone number is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="GSTIN Number"
            fullWidth
            required
            error={!!errors.gstNumber}
            helperText={errors.gstNumber?.message}
            {...register('gstNumber', { required: 'GST Number is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="FSSAI Licence Number"
            fullWidth
            required
            error={!!errors.fssaiNumber}
            helperText={errors.fssaiNumber?.message}
            {...register('fssaiNumber', { required: 'FSSAI number is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            fullWidth
            required
            multiline
            rows={2}
            error={!!errors.address}
            helperText={errors.address?.message}
            {...register('address', { required: 'Address is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="City"
            fullWidth
            required
            error={!!errors.city}
            helperText={errors.city?.message}
            {...register('city', { required: 'City is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="State"
            fullWidth
            required
            error={!!errors.state}
            helperText={errors.state?.message}
            {...register('state', { required: 'State is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Pincode"
            fullWidth
            required
            error={!!errors.pincode}
            helperText={errors.pincode?.message}
            {...register('pincode', { required: 'Pincode is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
