import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';
import { OrdersToolbar } from '../components/OrdersToolbar';
import { OrderGrid } from '../components/OrderGrid';
import { OrderDetailsDialog } from '../components/OrderDetailsDialog';
import { CancelOrderDialog } from '../components/CancelOrderDialog';
import type { OrderBill, OrderDetails } from '../api/ordersApi';

export const OrderHistoryPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [cancelTargetOrder, setCancelTargetOrder] = useState<OrderBill | null>(null);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [showTodayOnly, setShowTodayOnly] = useState(false);

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

  // Map Today's date filter
  useEffect(() => {
    if (showTodayOnly) {
      const todayStr = new Date().toISOString().split('T')[0];
      setDateFilter(todayStr);
      setPage(1);
    } else {
      setDateFilter('');
    }
  }, [showTodayOnly]);

  const handleFilterChange = (setter: Function, value: any) => {
    setter(value);
    setPage(1);
  };

  // Query: Fetch paginated orders from backend orders endpoint
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders-history', page, dateFilter, searchQuery, paymentFilter, orderTypeFilter, statusFilter],
    queryFn: () =>
      ordersApi.getOrders({
        page,
        limit,
        date: dateFilter || undefined,
        billNumber: searchQuery || undefined,
        paymentMode: paymentFilter !== 'ALL' ? paymentFilter : undefined,
        orderType: orderTypeFilter !== 'ALL' ? orderTypeFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }),
  });

  // Query: Fetch individual order details for Dialog modal
  const { data: activeOrderDetails } = useQuery<OrderDetails>({
    queryKey: ['order-details', selectedOrderId],
    queryFn: () => ordersApi.getOrderById(selectedOrderId!),
    enabled: !!selectedOrderId,
  });

  // Mutation: Cancel completed order
  const cancelMutation = useMutation({
    mutationFn: (orderId: number) => ordersApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders-history'] });
      queryClient.invalidateQueries({ queryKey: ['order-details'] });
      showNotification('Order cancelled successfully', 'success');
      setCancelTargetOrder(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel order';
      showNotification(msg, 'error');
      setCancelTargetOrder(null);
    },
  });

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrderId(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPaymentFilter('ALL');
    setOrderTypeFilter('ALL');
    setStatusFilter('ALL');
    setDateFilter('');
    setShowTodayOnly(false);
    setPage(1);
  };

  const handleConfirmCancel = () => {
    if (cancelTargetOrder) {
      cancelMutation.mutate(cancelTargetOrder.billId);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Failed to load orders history
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {(error as any).message || 'An unexpected error occurred'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Order History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse, inspect, and cancel completed POS orders.
        </Typography>
      </Box>

      {/* TOOLBAR */}
      <OrdersToolbar
        searchQuery={searchQuery}
        onSearchChange={(val) => handleFilterChange(setSearchQuery, val)}
        paymentFilter={paymentFilter}
        onPaymentChange={(val) => handleFilterChange(setPaymentFilter, val)}
        orderTypeFilter={orderTypeFilter}
        onOrderTypeChange={(val) => handleFilterChange(setOrderTypeFilter, val)}
        statusFilter={statusFilter}
        onStatusChange={(val) => handleFilterChange(setStatusFilter, val)}
        dateFilter={dateFilter}
        onDateChange={(val) => handleFilterChange(setDateFilter, val)}
        showTodayOnly={showTodayOnly}
        onTodayOnlyChange={setShowTodayOnly}
        onClear={handleClearFilters}
      />

      {/* GRID */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box>
          <OrderGrid
            orders={data?.orders || []}
            onView={handleViewDetails}
            onCancel={setCancelTargetOrder}
            cancelLoading={cancelMutation.isPending}
          />

          {/* PAGINATION */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={data.pagination.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Box>
      )}

      {/* DETAILS DIALOG */}
      <OrderDetailsDialog
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        order={activeOrderDetails || null}
      />

      {/* CANCEL CONFIRM DIALOG */}
      <CancelOrderDialog
        open={!!cancelTargetOrder}
        onClose={() => setCancelTargetOrder(null)}
        onConfirm={handleConfirmCancel}
        order={cancelTargetOrder}
        loading={cancelMutation.isPending}
      />

      {/* SNACKBAR NOTIFICATIONS */}
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
