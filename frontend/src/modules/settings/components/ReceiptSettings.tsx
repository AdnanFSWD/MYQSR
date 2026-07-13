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
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import type { SettingsData } from '../../../api/settingsApi';

interface ReceiptSettingsProps {
  initialData: SettingsData;
  onSubmit: (data: Partial<SettingsData>) => void;
  loading: boolean;
}

export const ReceiptSettings: React.FC<ReceiptSettingsProps> = ({
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
        Receipt Template Config
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Bill Number Prefix"
            fullWidth
            required
            error={!!errors.billPrefix}
            helperText={errors.billPrefix?.message}
            {...register('billPrefix', { required: 'Bill Prefix code is required' })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="printer-width-label">Thermal Printer Width</InputLabel>
            <Controller
              name="printerWidth"
              control={control}
              rules={{ required: 'Printer Width is required' }}
              render={({ field }) => (
                <Select
                  labelId="printer-width-label"
                  label="Thermal Printer Width"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value={58}>58mm Thermal Printer</MenuItem>
                  <MenuItem value={80}>80mm Thermal Printer</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Receipt Header Notice"
            fullWidth
            multiline
            rows={2}
            placeholder="e.g. Welcome to MYQSR!"
            error={!!errors.receiptHeader}
            helperText={errors.receiptHeader?.message}
            {...register('receiptHeader')}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Receipt Footer Greetings"
            fullWidth
            multiline
            rows={2}
            placeholder="e.g. Thank you for dining with us! Visit again."
            error={!!errors.receiptFooter}
            helperText={errors.receiptFooter?.message}
            {...register('receiptFooter')}
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
