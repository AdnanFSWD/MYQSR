import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import { Visibility as ViewIcon } from '@mui/icons-material';
import type { RecentOrder } from '../api/dashboardApi';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const orderTypeRenderer = (params: any) => {
    return params.value === 'DINE_IN' ? 'Dine In' : 'Take Away';
  };

  const totalRenderer = (params: any) => {
    const val = Number(params.value || 0);
    return `₹${val.toFixed(2)}`;
  };

  const statusRenderer = (params: any) => {
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

  const actionsRenderer = (params: any) => {
    const order = params.data as RecentOrder;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Button
          size="small"
          variant="text"
          startIcon={<ViewIcon fontSize="small" />}
          onClick={() => navigate(`/orders/${order.billId}`)}
        >
          View
        </Button>
      </Box>
    );
  };

  const columnDefs: ColDef<RecentOrder>[] = [
    {
      field: 'billNumber',
      headerName: 'Bill Number',
      sortable: true,
      flex: 1.3,
      minWidth: 140,
      cellStyle: { fontWeight: 700 },
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
      headerName: 'Type',
      sortable: true,
      cellRenderer: orderTypeRenderer,
      flex: 1.1,
      minWidth: 100,
    },
    {
      field: 'paymentMode',
      headerName: 'Payment',
      sortable: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'grandTotal',
      headerName: 'Total',
      sortable: true,
      cellRenderer: totalRenderer,
      flex: 1.1,
      minWidth: 100,
      cellStyle: { fontWeight: 700 },
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      cellRenderer: statusRenderer,
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Actions',
      cellRenderer: actionsRenderer,
      sortable: false,
      filter: false,
      flex: 1,
      minWidth: 100,
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        height: '100%',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
          Recent Orders
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Latest 10 order transactions processed in checkout.
        </Typography>

        {orders.length === 0 ? (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 250 }}>
            <Typography variant="body2" color="text.secondary">
              No orders processed yet
            </Typography>
          </Box>
        ) : (
          <Box
            className={isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
            sx={{
              flexGrow: 1,
              width: '100%',
              height: 280,
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
              rowHeight={48}
              headerHeight={44}
              domLayout="normal"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
