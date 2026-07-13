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
import type { OrderDetails } from '../api/ordersApi';
import { ReceiptPrinter } from '../../receipt/components/ReceiptPrinter';

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrderDetails | null;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onClose,
  order,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  if (!order) return null;

  const { billHeader, billItems, subtotal, discount, gst, grandTotal, restaurant } = order;

  const formattedDate = new Date(billHeader.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(billHeader.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedCancelDate = billHeader.cancelledAt
    ? new Date(billHeader.cancelledAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

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
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Order Details
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {restaurant.name}
          </Typography>
        </Box>
        <Chip
          label={billHeader.status}
          color={billHeader.status === 'COMPLETED' ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </DialogTitle>

      <DialogContent sx={{ py: 1.5 }}>
        {/* Restaurant Header Information */}
        <Box sx={{ mb: 3, p: 2, bgcolor: isDarkMode ? '#1E293B' : '#F8FAFC', borderRadius: '12px', border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Store Info
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {restaurant.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phone: {restaurant.phone}
          </Typography>
        </Box>

        {/* Bill Metadata Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Bill Number
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {billHeader.billNumber}
            </Typography>
          </Box>
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
              {billHeader.orderType === 'DINE_IN' ? 'Dine In' : 'Take Away'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Payment Mode
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {billHeader.paymentMode}
            </Typography>
          </Box>
          {billHeader.status === 'CANCELLED' && (
            <Box sx={{ gridColumn: 'span 2', mt: 1, p: 1.5, bgcolor: isDarkMode ? '#3B1F1F' : '#FDF2F2', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <Typography variant="caption" color="error" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                Cancellation Info
              </Typography>
              <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                Cancelled At: {formattedCancelDate}
              </Typography>
              {billHeader.cancelledBy && (
                <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                  Cancelled By User ID: {billHeader.cancelledBy}
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
              {billItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    ₹{item.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    ₹{item.lineTotal.toFixed(2)}
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
              ₹{subtotal.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Discount
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
              -₹{discount.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              GST (5%)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              ₹{gst.toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Grand Total
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
              ₹{grandTotal.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {restaurant.footerMessage && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {restaurant.footerMessage}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, display: 'flex', width: '100%', gap: 1.5, justifyContent: 'space-between' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          fullWidth
          sx={{ borderRadius: '8px', py: 1, fontWeight: 700 }}
        >
          Close
        </Button>
        <Box sx={{ width: '100%' }}>
          <ReceiptPrinter
            order={order}
            variant="contained"
            color="primary"
            disabled={billHeader.status !== 'COMPLETED'}
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
