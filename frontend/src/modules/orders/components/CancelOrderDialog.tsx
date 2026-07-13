import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import type { OrderBill } from '../api/ordersApi';

interface CancelOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  order: OrderBill | null;
  loading: boolean;
}

export const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
  open,
  onClose,
  onConfirm,
  order,
  loading,
}) => {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { borderRadius: '16px', p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>Confirm Order Cancellation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to cancel order <strong>{order.billNumber}</strong>?
          This will mark the order as CANCELLED. This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={loading}
          sx={{ borderRadius: '8px', fontWeight: 700 }}
        >
          Keep Order
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          autoFocus
          sx={{ borderRadius: '8px', fontWeight: 700, boxShadow: 'none' }}
        >
          Cancel Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};
