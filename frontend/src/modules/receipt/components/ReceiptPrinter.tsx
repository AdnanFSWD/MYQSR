import React from 'react';
import { Button } from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import { Receipt } from './Receipt';
import { printReceiptFromHTML } from '../utils/printHelper';

interface ReceiptPrinterProps {
  order: any;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'inherit' | 'error';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  disabled?: boolean;
}

export const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({
  order,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  label = 'Print Receipt',
  disabled = false,
}) => {
  const handlePrint = () => {
    if (!order) return;
    const printId = `receipt-print-area-${order.billHeader?.billId || 'direct'}`;
    const printArea = document.getElementById(printId);
    if (printArea) {
      printReceiptFromHTML(printArea.innerHTML);
    }
  };

  return (
    <>
      <Button
        onClick={handlePrint}
        variant={variant}
        color={color}
        size={size}
        disabled={disabled || !order}
        startIcon={<PrintIcon />}
        sx={{ borderRadius: '8px', fontWeight: 700 }}
      >
        {label}
      </Button>
      {/* Hidden DOM element holding the compiled receipt html for printing */}
      <div id={`receipt-print-area-${order?.billHeader?.billId || 'direct'}`} style={{ display: 'none' }}>
        <Receipt order={order} />
      </div>
    </>
  );
};
export default ReceiptPrinter;
