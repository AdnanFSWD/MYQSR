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

interface Category {
  id: number;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  itemCount: number;
}

interface CategoryGridProps {
  rowData: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  rowData,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Cell Renderer for Status
  const statusCellRenderer = (params: any) => {
    const isActive = params.value;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Chip
          label={isActive ? 'Active' : 'Inactive'}
          color={isActive ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Box>
    );
  };

  // Cell Renderer for Actions
  const actionsCellRenderer = (params: any) => {
    const category = params.data;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(category)}
          title="Edit Category"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onToggleStatus(category.id)}
          title={category.isActive ? 'Deactivate Category' : 'Activate Category'}
          color={category.isActive ? 'success' : 'default'}
        >
          {category.isActive ? (
            <ToggleOnIcon fontSize="medium" color="success" />
          ) : (
            <ToggleOffIcon fontSize="medium" color="action" />
          )}
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(category.id)}
          title="Delete Category"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  // Column Definitions
  const columnDefs: ColDef<Category>[] = [
    {
      field: 'code',
      headerName: 'Category Code',
      sortable: true,
      filter: true,
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: 'name',
      headerName: 'Category Name',
      sortable: true,
      filter: true,
      flex: 2,
      minWidth: 180,
    },
    {
      field: 'displayOrder',
      headerName: 'Display Order',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      sortable: true,
      filter: true,
      cellRenderer: statusCellRenderer,
      flex: 1,
      minWidth: 120,
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
        height: 450,
        width: '100%',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        // Overrides to customize grid aesthetics inside our theme
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
