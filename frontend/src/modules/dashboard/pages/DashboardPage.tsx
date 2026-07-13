import React from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  TrendingUp as SalesIcon,
  Receipt as OrdersIcon,
  Calculate as AovIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardCard } from '../components/DashboardCard';
import { HourlySalesChart } from '../components/HourlySalesChart';
import { PaymentSummaryCard } from '../components/PaymentSummaryCard';
import { TopSellingTable } from '../components/TopSellingTable';
import { RecentOrdersTable } from '../components/RecentOrdersTable';

export const DashboardPage: React.FC = () => {
  // Query: Fetch dashboard calculations, auto-refreshed every 60s (60000ms)
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['owner-dashboard'],
    queryFn: dashboardApi.getDashboardData,
    refetchInterval: 60000, // 60 seconds auto-refresh polling
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Calculating dashboard metrics...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ fontWeight: 800, mb: 1 }}>
          Failed to load dashboard metrics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {(error as any)?.message || 'An unexpected query error occurred'}
        </Typography>
        <Button variant="contained" onClick={() => refetch()} startIcon={<RefreshIcon />}>
          Try Again
        </Button>
      </Box>
    );
  }

  const { today, paymentSummary, topSellingItems, hourlySales, recentOrders } = data;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Title Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Store Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time analytics and transaction audits (auto-refreshes every 60s).
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => refetch()}
          disabled={isFetching}
          startIcon={<RefreshIcon className={isFetching ? 'spin' : ''} />}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {/* TOP ROW: KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Today's Sales"
            value={`₹${today.sales.toFixed(2)}`}
            icon={<SalesIcon />}
            gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
            shadowColor="rgba(16, 185, 129, 0.15)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Today's Orders"
            value={today.orders}
            icon={<OrdersIcon />}
            gradient="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
            shadowColor="rgba(59, 130, 246, 0.15)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Average Order Value"
            value={`₹${today.averageOrderValue.toFixed(2)}`}
            icon={<AovIcon />}
            gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
            shadowColor="rgba(139, 92, 246, 0.15)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Cancelled Orders"
            value={today.cancelledOrders}
            icon={<CancelIcon />}
            gradient="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
            shadowColor="rgba(239, 68, 68, 0.15)"
          />
        </Grid>
      </Grid>

      {/* SECOND ROW: CHARTS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <HourlySalesChart data={hourlySales} />
        </Grid>
        <Grid item xs={12} md={4}>
          <PaymentSummaryCard summary={paymentSummary} />
        </Grid>
      </Grid>

      {/* THIRD ROW: TABLES */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TopSellingTable items={topSellingItems} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentOrdersTable orders={recentOrders} />
        </Grid>
      </Grid>

      {/* Dynamic spinning styles for refresh button */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </Box>
  );
};
