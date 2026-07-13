import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { POSPage } from '../pages/pos/POSPage';
import { CategoriesPage } from '../pages/menu/CategoriesPage';
import { MenuItemsPage } from '../pages/menu/MenuItemsPage';
import { Inventory } from '../pages/Inventory';
import { Sales } from '../pages/Sales';
import { Reports } from '../pages/Reports';
import { SettingsPage } from '../modules/settings/pages/SettingsPage';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { OrderHistoryPage } from '../modules/orders/pages/OrderHistoryPage';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 800, color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary">
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Layout and sub-routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="pos" element={<POSPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="menu-items" element={<MenuItemsPage />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="sales" element={<Sales />} />
        <Route path="sales/bills/:id" element={<Sales />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};
