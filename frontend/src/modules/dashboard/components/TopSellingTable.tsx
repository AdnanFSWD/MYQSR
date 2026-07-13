import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import type { TopSellingItem } from '../api/dashboardApi';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface TopSellingTableProps {
  items: TopSellingItem[];
}

export const TopSellingTable: React.FC<TopSellingTableProps> = ({ items }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const totalRenderer = (params: any) => {
    const val = Number(params.value || 0);
    return `₹${val.toFixed(2)}`;
  };

  const columnDefs: ColDef<TopSellingItem>[] = [
    {
      field: 'name',
      headerName: 'Item Name',
      sortable: true,
      flex: 1.5,
      minWidth: 140,
      cellStyle: { fontWeight: 700 },
    },
    {
      field: 'quantity',
      headerName: 'Qty Sold',
      sortable: true,
      flex: 1,
      minWidth: 90,
      cellStyle: { fontWeight: 600 },
    },
    {
      field: 'sales',
      headerName: 'Total Revenue',
      sortable: true,
      cellRenderer: totalRenderer,
      flex: 1.2,
      minWidth: 110,
      cellStyle: { fontWeight: 700 },
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
          Top Selling Items
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Top menu items by quantity sold.
        </Typography>

        {items.length === 0 ? (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 250 }}>
            <Typography variant="body2" color="text.secondary">
              No sales data found
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
              },
            }}
          >
            <AgGridReact
              rowData={items}
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
