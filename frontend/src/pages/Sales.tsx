import React, { useState, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AgGridReact } from 'ag-grid-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/salesApi';
import type { BillSummary } from '../api/salesApi';
import { ReceiptPrinter } from '../modules/receipt/components/ReceiptPrinter';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export const Sales: React.FC = () => {
  const queryClient = useQueryClient();
  const gridRef = useRef<any>(null);

  // States
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [date, setDate] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [orderType, setOrderType] = useState('');
  const [status, setStatus] = useState('');

  // Dialog & Action States
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [billToCancel, setBillToCancel] = useState<BillSummary | null>(null);

  // Notifications
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  // Queries
  const { data: salesData, refetch } = useQuery({
    queryKey: ['sales-bills', { page, limit, date, billNumber, paymentMode, orderType, status }],
    queryFn: () => salesApi.getBills({ page, limit, date, billNumber, paymentMode, orderType, status }),
  });

  const { data: billDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['bill-details', selectedBillId],
    queryFn: () => salesApi.getBillById(selectedBillId!),
    enabled: !!selectedBillId && detailsOpen,
  });

  // Mutations
  const cancelMutation = useMutation({
    mutationFn: (id: number) => salesApi.cancelBill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-bills'] });
      queryClient.invalidateQueries({ queryKey: ['bill-details'] });
      showNotification('Bill cancelled successfully', 'success');
      setCancelConfirmOpen(false);
      setBillToCancel(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel bill';
      showNotification(msg, 'error');
    },
  });

  // Handlers
  const handleView = (id: number) => {
    setSelectedBillId(id);
    setDetailsOpen(true);
  };

  const handleCancelClick = (bill: BillSummary) => {
    setBillToCancel(bill);
    setCancelConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (billToCancel) {
      cancelMutation.mutate(billToCancel.id);
    }
  };

  const handleTodayFilter = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setDate(todayStr);
  };

  const handleResetFilters = () => {
    setDate('');
    setBillNumber('');
    setPaymentMode('');
    setOrderType('');
    setStatus('');
    setPage(1);
  };

  // AG Grid Columns Configuration
  const columnDefs: any = useMemo(() => [
    {
      field: 'billNumber',
      headerName: 'Bill Number',
      sortable: true,
      filter: true,
      flex: 1.5,
      cellStyle: { fontWeight: 700 },
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1.2,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      field: 'createdAt',
      headerName: 'Time',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      field: 'orderType',
      headerName: 'Order Type',
      flex: 1.1,
      cellRenderer: (params: any) => {
        const val = params.value;
        return val === 'DINE_IN' ? 'Dine In' : 'Take Away';
      },
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      flex: 1.1,
    },
    {
      field: 'grandTotal',
      headerName: 'Grand Total',
      flex: 1.2,
      cellStyle: { fontWeight: 800 },
      valueFormatter: (params: any) => {
        return `₹${Number(params.value).toFixed(2)}`;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      cellRenderer: (params: any) => {
        const val = params.value;
        return (
          <Chip
            label={val}
            color={val === 'COMPLETED' ? 'success' : 'error'}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        );
      },
    },
    {
      headerName: 'Actions',
      sortable: false,
      filter: false,
      flex: 1.5,
      cellRenderer: (params: any) => {
        const bill = params.data as BillSummary;
        const isCompleted = bill.status === 'COMPLETED';

        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
            <Button
              size="small"
              variant="text"
              startIcon={<ViewIcon fontSize="small" />}
              onClick={() => handleView(bill.id)}
            >
              View
            </Button>
            <Button
              size="small"
              variant="text"
              color="error"
              disabled={!isCompleted || cancelMutation.isPending}
              startIcon={<CancelIcon fontSize="small" />}
              onClick={() => handleCancelClick(bill)}
            >
              Cancel
            </Button>
          </Box>
        );
      },
    },
  ], [cancelMutation.isPending]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Sales History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage transactions, check historical bills, and process order cancellations.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()}>
          Refresh
        </Button>
      </Box>

      {/* Toolbar / Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '12px', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }} variant="outlined">
        <TextField
          size="small"
          label="Search Bill Number"
          value={billNumber}
          onChange={(e) => setBillNumber(e.target.value)}
          sx={{ width: 200 }}
        />
        <TextField
          size="small"
          type="date"
          label="Date Filter"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ width: 160 }}
        />
        <Button
          variant="outlined"
          startIcon={<TodayIcon />}
          onClick={handleTodayFilter}
          sx={{ borderRadius: '8px' }}
        >
          Today
        </Button>

        <FormControl size="small" sx={{ width: 140 }}>
          <InputLabel>Payment Mode</InputLabel>
          <Select
            value={paymentMode}
            label="Payment Mode"
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <MenuItem value="">All Modes</MenuItem>
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="CARD">Card</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: 140 }}>
          <InputLabel>Order Type</InputLabel>
          <Select
            value={orderType}
            label="Order Type"
            onChange={(e) => setOrderType(e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="DINE_IN">Dine In</MenuItem>
            <MenuItem value="TAKE_AWAY">Take Away</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button color="secondary" onClick={handleResetFilters}>
          Clear
        </Button>
      </Paper>

      {/* Grid Container */}
      <Paper
        className="ag-theme-alpine"
        sx={{
          height: 'calc(100vh - 300px)',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={salesData?.bills || []}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            filter: false,
          }}
          pagination={true}
          paginationPageSize={limit}
          loadingCellRendererParams={{
            loadingMessage: 'Loading sales logs...',
          }}
        />
      </Paper>

      {/* Bill Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Bill Details
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {selectedBillId}
            </Typography>
          </Box>
          <IconButton onClick={() => setDetailsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2 }}>
          {detailsLoading || !billDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>Loading bill details...</Typography>
            </Box>
          ) : (
            <Box>
              {/* Header metadata grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Bill Number</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{billDetails.billHeader.billNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date & Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{new Date(billDetails.billHeader.createdAt).toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Order Type</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{billDetails.billHeader.orderType === 'DINE_IN' ? 'Dine In' : 'Take Away'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Payment Mode</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{billDetails.billHeader.paymentMode}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Items ordered list table */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Items Ordered</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px', mb: 3 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Qty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billDetails.billItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ fontSize: '0.85rem' }}>{item.name}</TableCell>
                        <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{item.quantity}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.85rem' }}>₹{item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>₹{item.lineTotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '60%', ml: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{billDetails.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Discount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>-₹{billDetails.discount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">GST (5%)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{billDetails.gst.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Grand Total</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>₹{billDetails.grandTotal.toFixed(2)}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5, justifyContent: 'space-between' }}>
          <Button onClick={() => setDetailsOpen(false)} variant="outlined" color="inherit" fullWidth sx={{ borderRadius: '8px' }}>
            Close
          </Button>
          {billDetails && (
            <Box sx={{ width: '100%' }}>
              <ReceiptPrinter
                order={{
                  billHeader: billDetails.billHeader,
                  billItems: billDetails.billItems,
                  subtotal: billDetails.subtotal,
                  discount: billDetails.discount,
                  gst: billDetails.gst,
                  grandTotal: billDetails.grandTotal,
                  restaurant: {
                    name: 'MYQSR Express',
                    address: '123 Food Street, Tech Park, Hyderabad',
                    phone: '+91 98765 43210',
                    footerMessage: 'Thank you for dining with us! Please visit again.',
                  },
                }}
                variant="contained"
                color="primary"
                disabled={billDetails.billHeader.status !== 'COMPLETED'}
              />
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelConfirmOpen} onClose={() => setCancelConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Cancel Transaction</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to cancel bill **{billToCancel?.billNumber}**? This action will set the status to CANCELLED and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelConfirmOpen(false)} color="inherit">
            No, Keep
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            disabled={cancelMutation.isPending}
            startIcon={cancelMutation.isPending && <CircularProgress size={16} />}
          >
            Yes, Cancel Bill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4500}
        onClose={() => setNotification((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification((p) => ({ ...p, open: false }))}
          variant="filled"
          sx={{ borderRadius: '8px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
