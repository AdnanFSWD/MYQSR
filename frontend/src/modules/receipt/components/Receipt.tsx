import React from 'react';
import { Box, Typography } from '@mui/material';

interface ReceiptProps {
  order: any; // Supports OrderDetails response structure
}

export const Receipt: React.FC<ReceiptProps> = ({ order }) => {
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

  return (
    <Box
      className="receipt-print-wrapper"
      sx={{
        width: '80mm',
        padding: '4mm',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: 1.4,
        boxSizing: 'border-box',
        border: '1px solid #E2E8F0', // Border for preview card
        '@media print': {
          border: 'none',
          padding: '0',
          margin: '0',
          width: '100%',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: 'inherit', fontSize: '16px', textTransform: 'uppercase' }}>
          {restaurant.name}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'inherit', mt: 0.5 }}>
          {restaurant.address}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>
          Phone: {restaurant.phone}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
          GSTIN: 36AAAAA1111A1Z1
        </Typography>
      </Box>

      {/* Divider */}
      <Box sx={{ mb: 1.5, textAlign: 'center', userSelect: 'none' }}>
        - - - - - - - - - - - - - - - - - - - - - -
      </Box>

      {/* Bill Meta */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>BILL NO:</span>
          <span>{billHeader.billNumber}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>DATE:</span>
          <span>{formattedDate} {formattedTime}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>TYPE:</span>
          <span>{billHeader.orderType === 'DINE_IN' ? 'DINE IN' : 'TAKE AWAY'}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>PAYMENT:</span>
          <span>{billHeader.paymentMode}</span>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ mb: 1.5, textAlign: 'center', userSelect: 'none' }}>
        - - - - - - - - - - - - - - - - - - - - - -
      </Box>

      {/* Items Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, mb: 1 }}>
        <span style={{ flexGrow: 1, textAlign: 'left' }}>ITEM</span>
        <span style={{ width: '40px', textAlign: 'center' }}>QTY</span>
        <span style={{ width: '60px', textAlign: 'right' }}>RATE</span>
        <span style={{ width: '70px', textAlign: 'right' }}>TOTAL</span>
      </Box>

      {/* Items List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 1.5 }}>
        {billItems.map((item: any) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ flexGrow: 1, textAlign: 'left', overflowWrap: 'break-word', maxWidth: '110px' }}>
              {item.name}
            </span>
            <span style={{ width: '40px', textAlign: 'center' }}>{item.quantity}</span>
            <span style={{ width: '60px', textAlign: 'right' }}>{Number(item.unitPrice).toFixed(2)}</span>
            <span style={{ width: '70px', textAlign: 'right', fontWeight: 600 }}>
              {Number(item.lineTotal).toFixed(2)}
            </span>
          </Box>
        ))}
      </Box>

      {/* Divider */}
      <Box sx={{ mb: 1.5, textAlign: 'center', userSelect: 'none' }}>
        - - - - - - - - - - - - - - - - - - - - - -
      </Box>

      {/* Totals */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2, alignItems: 'flex-end' }}>
        <Box sx={{ display: 'flex', width: '150px', justifyContent: 'space-between' }}>
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </Box>
        {discount > 0 && (
          <Box sx={{ display: 'flex', width: '150px', justifyContent: 'space-between', color: 'error.main' }}>
            <span>Discount:</span>
            <span>-₹{discount.toFixed(2)}</span>
          </Box>
        )}
        <Box sx={{ display: 'flex', width: '150px', justifyContent: 'space-between' }}>
          <span>GST (5%):</span>
          <span>₹{gst.toFixed(2)}</span>
        </Box>
        <Box sx={{ display: 'flex', width: '150px', justifyContent: 'space-between', fontWeight: 700, mt: 0.5, fontSize: '13px' }}>
          <span>GRAND TOTAL:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ mb: 2, textAlign: 'center', userSelect: 'none' }}>
        - - - - - - - - - - - - - - - - - - - - - -
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
          {restaurant.footerMessage || 'Thank you for dining with us!'}
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: 'inherit', color: 'text.secondary', display: 'block', mt: 0.5 }}>
          Please visit again.
        </Typography>
      </Box>
    </Box>
  );
};
