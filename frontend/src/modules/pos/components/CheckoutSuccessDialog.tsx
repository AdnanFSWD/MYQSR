import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import type { CheckoutResponseData } from '../api/checkoutApi';
import { ReceiptPrinter } from '../../receipt/components/ReceiptPrinter';

interface CheckoutSuccessDialogProps {
  open: boolean;
  data: CheckoutResponseData | null;
  onNewOrder: () => void;
  onViewOrder: () => void;
  orderForPrinting: any;
}

export const CheckoutSuccessDialog: React.FC<CheckoutSuccessDialogProps> = ({
  open,
  data,
  onNewOrder,
  onViewOrder,
  orderForPrinting,
}) => {
  if (!data) return null;

  const { billNumber, createdAt, orderType, paymentMode, grandTotal, items } = data;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate total items count
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Dialog
      open={open}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 2,
            textAlign: 'center',
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 54, mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Order Completed Successfully
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The checkout transaction completed successfully.
        </Typography>

        {/* Invoice Summary Data */}
        <Box sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1E293B' : '#F8FAFC', p: 2, borderRadius: '12px', border: (theme) => `1px solid ${theme.palette.divider}`, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Bill Number</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{billNumber}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date & Time</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formattedDate} | {formattedTime}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Order Type</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{orderType === 'DINE_IN' ? 'Dine In' : 'Take Away'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Payment Mode</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{paymentMode}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Item Count</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{itemCount} items</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>Grand Total</Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 900 }}>₹{Number(grandTotal).toFixed(2)}</Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
        <Box sx={{ display: 'flex', width: '100%', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            onClick={onNewOrder}
            sx={{ borderRadius: '10px', py: 1, fontWeight: 700 }}
          >
            New Order
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onViewOrder}
            sx={{ borderRadius: '10px', py: 1, fontWeight: 700, boxShadow: 'none' }}
          >
            View Order
          </Button>
        </Box>

        {/* Enabled Print Receipt Action button via ReceiptPrinter */}
        <Box sx={{ width: '100%' }}>
          <ReceiptPrinter
            order={orderForPrinting}
            variant="outlined"
            color="primary"
            size="medium"
            disabled={!orderForPrinting}
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
