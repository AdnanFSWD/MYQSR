import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { Box, IconButton, Chip } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface MenuItemData {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  shortCode: string;
  description?: string | null;
  price: number;
  image: string;
  isAvailable: boolean;
  displayOrder: number;
}

interface MenuItemGridProps {
  rowData: MenuItemData[];
  onEdit: (item: MenuItemData) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export const MenuItemGrid: React.FC<MenuItemGridProps> = ({
  rowData,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Cell Renderer for Image preview
  const imageCellRenderer = (params: any) => {
    const imgName = params.value;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Box
          component="img"
          src={`/images/menu/${imgName}`}
          alt="Menu item thumbnail"
          sx={{
            width: 36,
            height: 36,
            borderRadius: '6px',
            border: '1px solid',
            borderColor: 'divider',
            objectFit: 'contain',
            backgroundColor: 'action.hover',
          }}
        />
      </Box>
    );
  };

  // Cell Renderer for Price
  const priceCellRenderer = (params: any) => {
    const price = params.value;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', fontWeight: 700, color: 'primary.main' }}>
        ${Number(price).toFixed(2)}
      </Box>
    );
  };

  // Cell Renderer for Availability
  const availabilityCellRenderer = (params: any) => {
    const isAvailable = params.value;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip
          label={isAvailable ? 'Available' : 'Unavailable'}
          color={isAvailable ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Box>
    );
  };

  // Cell Renderer for Actions
  const actionsCellRenderer = (params: any) => {
    const item = params.data;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(item)}
          title="Edit Menu Item"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onToggleAvailability(item.id)}
          title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
          color={item.isAvailable ? 'success' : 'default'}
        >
          {item.isAvailable ? (
            <ToggleOnIcon fontSize="medium" color="success" />
          ) : (
            <ToggleOffIcon fontSize="medium" color="action" />
          )}
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(item.id)}
          title="Delete Menu Item"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  // Column Definitions
  const columnDefs: ColDef<MenuItemData>[] = [
    {
      field: 'image',
      headerName: 'Image',
      cellRenderer: imageCellRenderer,
      sortable: false,
      filter: false,
      width: 80,
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      filter: true,
      flex: 2,
      minWidth: 150,
    },
    {
      field: 'shortCode',
      headerName: 'Short Code',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'categoryName',
      headerName: 'Category',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'price',
      headerName: 'Price',
      sortable: true,
      filter: true,
      cellRenderer: priceCellRenderer,
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'isAvailable',
      headerName: 'Available',
      sortable: true,
      filter: true,
      cellRenderer: availabilityCellRenderer,
      flex: 1,
      minWidth: 110,
    },
    {
      field: 'displayOrder',
      headerName: 'Display Order',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Actions',
      cellRenderer: actionsCellRenderer,
      sortable: false,
      filter: false,
      flex: 1,
      minWidth: 160,
    },
  ];

  return (
    <Box
      className={isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
      sx={{
        height: 480,
        width: '100%',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        // Custom header and row styles inside active theme
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
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
        rowHeight={52}
        headerHeight={48}
        domLayout="normal"
      />
    </Box>
  );
};
