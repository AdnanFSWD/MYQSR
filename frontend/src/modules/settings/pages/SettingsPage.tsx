import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Storefront as RestaurantIcon,
  Receipt as ReceiptIcon,
  SettingsApplications as AppIcon,
  AccountBalanceWallet as BillingIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../../api/settingsApi';
import { RestaurantSettings } from '../components/RestaurantSettings';
import { BillingSettings } from '../components/BillingSettings';
import { ReceiptSettings } from '../components/ReceiptSettings';
import { ApplicationSettings } from '../components/ApplicationSettings';
import type { SettingsData } from '../../../api/settingsApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);

  // Snackbar Notification State
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch Settings query
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['restaurant-settings'],
    queryFn: settingsApi.getSettings,
  });

  // Update Settings mutation
  const saveMutation = useMutation({
    mutationFn: (payload: Partial<SettingsData>) => settingsApi.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-settings'] });
      showNotification('Settings updated successfully', 'success');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to update settings';
      showNotification(msg, 'error');
    },
  });

  const handleTabChange = (newValue: any) => {
    setActiveTab(newValue);
  };

  const handleSave = (formData: Partial<SettingsData>) => {
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Loading store settings...
        </Typography>
      </Box>
    );
  }

  if (error || !settings) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ fontWeight: 800, mb: 1 }}>
          Failed to load settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {(error as any)?.message || 'An unexpected query error occurred'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Store Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage restaurant branding, tax rates, thermal printer styles, and localizations.
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          overflow: 'hidden',
          p: 1.5,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="store-settings-tabs"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab
              icon={<RestaurantIcon fontSize="small" />}
              iconPosition="start"
              label="Restaurant Info"
              sx={{ fontWeight: 700, textTransform: 'none', py: 2 }}
            />
            <Tab
              icon={<BillingIcon fontSize="small" />}
              iconPosition="start"
              label="Billing Setup"
              sx={{ fontWeight: 700, textTransform: 'none', py: 2 }}
            />
            <Tab
              icon={<ReceiptIcon fontSize="small" />}
              iconPosition="start"
              label="Receipt Styles"
              sx={{ fontWeight: 700, textTransform: 'none', py: 2 }}
            />
            <Tab
              icon={<AppIcon fontSize="small" />}
              iconPosition="start"
              label="Application Setup"
              sx={{ fontWeight: 700, textTransform: 'none', py: 2 }}
            />
          </Tabs>
        </Box>

        <Box sx={{ px: 2 }}>
          <CustomTabPanel value={activeTab} index={0}>
            <RestaurantSettings
              initialData={settings}
              onSubmit={handleSave}
              loading={saveMutation.isPending}
            />
          </CustomTabPanel>
          <CustomTabPanel value={activeTab} index={1}>
            <BillingSettings
              initialData={settings}
              onSubmit={handleSave}
              loading={saveMutation.isPending}
            />
          </CustomTabPanel>
          <CustomTabPanel value={activeTab} index={2}>
            <ReceiptSettings
              initialData={settings}
              onSubmit={handleSave}
              loading={saveMutation.isPending}
            />
          </CustomTabPanel>
          <CustomTabPanel value={activeTab} index={3}>
            <ApplicationSettings
              initialData={settings}
              onSubmit={handleSave}
              loading={saveMutation.isPending}
            />
          </CustomTabPanel>
        </Box>
      </Paper>

      {/* Snackbar alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default SettingsPage;
