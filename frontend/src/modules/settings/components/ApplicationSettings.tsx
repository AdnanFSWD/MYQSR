import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
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

interface ApplicationSettingsProps {
  initialData: SettingsData;
  onSubmit: (data: Partial<SettingsData>) => void;
  loading: boolean;
}

export const ApplicationSettings: React.FC<ApplicationSettingsProps> = ({
  initialData,
  onSubmit,
  loading,
}) => {
  const {
    handleSubmit,
    control,
  } = useForm<SettingsData>({
    defaultValues: initialData,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
        Application Configurations
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <InputLabel id="timezone-label">Timezone</InputLabel>
            <Controller
              name="timezone"
              control={control}
              rules={{ required: 'Timezone is required' }}
              render={({ field }) => (
                <Select
                  labelId="timezone-label"
                  label="Timezone"
                  {...field}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
                  <MenuItem value="Asia/Kolkata">IST (Indian Standard Time)</MenuItem>
                  <MenuItem value="America/New_York">EST (Eastern Standard Time)</MenuItem>
                  <MenuItem value="Europe/London">GMT (Greenwich Mean Time)</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <InputLabel id="date-format-label">Date Format</InputLabel>
            <Controller
              name="dateFormat"
              control={control}
              rules={{ required: 'Date format is required' }}
              render={({ field }) => (
                <Select
                  labelId="date-format-label"
                  label="Date Format"
                  {...field}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="DD-MM-YYYY">DD-MM-YYYY (e.g. 10-07-2026)</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-07-10)</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (e.g. 07/10/2026)</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <InputLabel id="time-format-label">Time Format</InputLabel>
            <Controller
              name="timeFormat"
              control={control}
              rules={{ required: 'Time format is required' }}
              render={({ field }) => (
                <Select
                  labelId="time-format-label"
                  label="Time Format"
                  {...field}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="12-hour">12-Hour format (e.g. 04:30 PM)</MenuItem>
                  <MenuItem value="24-hour">24-Hour format (e.g. 16:30)</MenuItem>
                </Select>
              )}
            />
          </FormControl>
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
