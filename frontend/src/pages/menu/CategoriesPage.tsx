import React, { useState, useMemo } from 'react';
import { Box, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryToolbar } from '../../components/category/CategoryToolbar';
import { CategoryGrid } from '../../components/category/CategoryGrid';
import { CategoryDialog } from '../../components/category/CategoryDialog';
import { categoryApi } from '../../api/categoryApi';
import type { Category } from '../../api/categoryApi';

export const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Snackbar Notification State
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // 1. Query: Fetch Categories
  const { data: categories = [], isLoading, error } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  // 2. Mutation: Create Category
  const createMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showNotification('Category created successfully', 'success');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to create category';
      showNotification(msg, 'error');
    },
  });

  // 3. Mutation: Update Category
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showNotification('Category updated successfully', 'success');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to update category';
      showNotification(msg, 'error');
    },
  });

  // 4. Mutation: Delete Category
  const deleteMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showNotification('Category deleted successfully', 'success');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to delete category';
      showNotification(msg, 'error');
    },
  });

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.code.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [categories, searchValue]);

  // Dialog actions handlers
  const handleAddClick = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleSave = (data: Omit<Category, 'id' | 'itemCount'> & { id?: number }) => {
    if (data.id) {
      // Edit Mode
      updateMutation.mutate({
        id: data.id,
        data: {
          code: data.code,
          name: data.name,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        },
      });
    } else {
      // Add Mode
      createMutation.mutate({
        code: data.code,
        name: data.name,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      updateMutation.mutate({
        id,
        data: { isActive: !category.isActive },
      });
    }
  };

  // If query failed to load
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Failed to load categories
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {(error as any).message || 'An unexpected error occurred'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Category Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Organize, filter, add, edit, and toggle status of menu food categories.
        </Typography>
      </Box>

      {/* Toolbar for Search and Add trigger */}
      <CategoryToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onAddClick={handleAddClick}
      />

      {/* Categories Data Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <CategoryGrid
          rowData={filteredCategories}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Add / Edit Form Modal */}
      <CategoryDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
        initialData={selectedCategory}
      />

      {/* Success/Error Snackbars */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
