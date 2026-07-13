import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Print as PrintIcon, Close as CloseIcon } from '@mui/icons-material';
import { Receipt } from './Receipt';
import { printReceiptFromHTML } from '../utils/printHelper';

interface ReceiptPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  order: any | null; // Supports OrderDetails
}

export const ReceiptPreviewDialog: React.FC<ReceiptPreviewDialogProps> = ({
  open,
  onClose,
  order,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    const printArea = document.getElementById('receipt-print-area');
    if (printArea) {
      printReceiptFromHTML(printArea.innerHTML);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Receipt Preview
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0F172A' : '#F1F5F9', display: 'flex', justifyContent: 'center' }}>
        {/* Container wrapping the receipt to extract html for printing */}
        <Box id="receipt-print-area" sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
          <Receipt order={order} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          startIcon={<CloseIcon />}
          sx={{ borderRadius: '8px', fontWeight: 700 }}
        >
          Close
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          sx={{ borderRadius: '8px', fontWeight: 700, boxShadow: 'none' }}
        >
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ReceiptPreviewDialog;
