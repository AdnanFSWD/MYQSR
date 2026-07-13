import React from 'react';
import { Box, Chip, Button, useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import {
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import type { OrderBill } from '../api/ordersApi';

interface OrderGridProps {
  orders: OrderBill[];
  onView: (id: number) => void;
  onCancel: (order: OrderBill) => void;
  cancelLoading: boolean;
}

export const OrderGrid: React.FC<OrderGridProps> = ({
  orders,
  onView,
  onCancel,
  cancelLoading,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Cell Renderers
  const orderTypeCellRenderer = (params: any) => {
    return params.value === 'DINE_IN' ? 'Dine In' : 'Take Away';
  };

  const totalCellRenderer = (params: any) => {
    const val = Number(params.value || 0);
    return `₹${val.toFixed(2)}`;
  };

  const statusCellRenderer = (params: any) => {
    const status = params.value;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip
          label={status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
          color={status === 'COMPLETED' ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Box>
    );
  };

  const actionsCellRenderer = (params: any) => {
    const order = params.data as OrderBill;
    const isCompleted = order.status === 'COMPLETED';

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
        <Button
          size="small"
          variant="text"
          startIcon={<ViewIcon fontSize="small" />}
          onClick={() => onView(order.billId)}
        >
          View
        </Button>
        <Button
          size="small"
          variant="text"
          color="error"
          disabled={!isCompleted || cancelLoading}
          startIcon={<CancelIcon fontSize="small" />}
          onClick={() => onCancel(order)}
        >
          Cancel
        </Button>
      </Box>
    );
  };

  // AG Grid Column Definitions
  const columnDefs: ColDef<OrderBill>[] = [
    {
      field: 'billNumber',
      headerName: 'Bill Number',
      sortable: true,
      flex: 1.3,
      minWidth: 140,
      cellStyle: { fontWeight: 700 },
    },
    {
      field: 'date',
      headerName: 'Date',
      sortable: true,
      flex: 1.1,
      minWidth: 120,
    },
    {
      field: 'time',
      headerName: 'Time',
      sortable: true,
      flex: 0.9,
      minWidth: 90,
    },
    {
      field: 'orderType',
      headerName: 'Order Type',
      sortable: true,
      cellRenderer: orderTypeCellRenderer,
      flex: 1.1,
      minWidth: 110,
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      sortable: true,
      flex: 1.1,
      minWidth: 110,
    },
    {
      field: 'totalItems',
      headerName: 'Items',
      sortable: true,
      flex: 0.8,
      minWidth: 80,
    },
    {
      field: 'grandTotal',
      headerName: 'Grand Total',
      sortable: true,
      cellRenderer: totalCellRenderer,
      flex: 1.1,
      minWidth: 110,
      cellStyle: { fontWeight: 700 },
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      cellRenderer: statusCellRenderer,
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Actions',
      cellRenderer: actionsCellRenderer,
      sortable: false,
      filter: false,
      flex: 1.5,
      minWidth: 160,
    },
  ];

  return (
    <Box
      className={isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
      sx={{
        height: 480,
        width: '100%',
        boxShadow: 'none',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        '& .ag-root-wrapper': {
          border: 'none',
        },
        '& .ag-header': {
          backgroundColor: isDarkMode ? '#1F2937' : '#F8FAFC',
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        '& .ag-row': {
          borderBottom: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
          },
        },
      }}
    >
      <AgGridReact
        rowData={orders}
        columnDefs={columnDefs}
        animateRows={true}
        rowHeight={52}
        headerHeight={48}
        domLayout="normal"
      />
    </Box>
  );
};
