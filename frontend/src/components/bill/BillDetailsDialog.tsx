import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';

interface BillDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  bill: any | null; // Supports SalesBillDetails or legacy Bill
}

export const BillDetailsDialog: React.FC<BillDetailsDialogProps> = ({
  open,
  onClose,
  bill,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  if (!bill) return null;

  const formattedDate = new Date(bill.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(bill.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedCancelDate = bill.cancelledAt
    ? new Date(bill.cancelledAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  // Safe totals extraction
  const subtotalVal = bill.totals ? Number(bill.totals.subtotal) : Number(bill.subtotal || 0);
  const discountVal = bill.totals ? Number(bill.totals.discount) : Number(bill.discount || 0);
  const gstVal = bill.totals ? Number(bill.totals.gst ?? bill.totals.gstAmount) : Number(bill.gstAmount || 0);
  const grandTotalVal = bill.totals ? Number(bill.totals.grandTotal) : Number(bill.grandTotal ?? bill.total ?? 0);

  const itemsList = bill.items || bill.billItems || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 1.5,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Bill Details - {bill.billNumber}
        </Typography>
        <Chip
          label={bill.status}
          color={bill.status === 'COMPLETED' ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </DialogTitle>

      <DialogContent sx={{ py: 1.5 }}>
        {/* Bill Metadata Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Date & Time
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formattedDate} | {formattedTime}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Order Type
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {bill.orderType === 'DINE_IN' ? 'Dine In' : 'Take Away'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Payment Mode
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {bill.paymentMode}
            </Typography>
          </Box>
          {bill.status === 'CANCELLED' && (
            <Box sx={{ gridColumn: 'span 2', mt: 1, p: 1.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#3B1F1F' : '#FDF2F2', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <Typography variant="caption" color="error" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                Cancellation Info
              </Typography>
              <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                Cancelled At: {formattedCancelDate}
              </Typography>
              {bill.cancelledBy && (
                <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                  Cancelled By User ID: {bill.cancelledBy}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Invoice Item Table */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
          Items ordered
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px', boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: isDarkMode ? '#1E293B' : '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsList.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.name || item.menuItemName || item.menuItem?.name || `Item #${item.menuItemId}`}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    ₹{Number(item.unitPrice).toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    ₹{Number(item.lineTotal ?? item.total ?? 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals Invoice Breakdown */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '60%', ml: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Subtotal
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              ₹{subtotalVal.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Discount
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
              -₹{discountVal.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              GST (5%)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              ₹{gstVal.toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Grand Total
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
              ₹{grandTotalVal.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="contained" color="inherit" fullWidth sx={{ borderRadius: '8px', py: 1, fontWeight: 700 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
