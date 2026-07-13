import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from '@mui/material';

// Define Zod validation schema
const categorySchema = z.object({
  code: z.string().trim().toUpperCase().min(1, 'Category code is required').max(50, 'Category code must be 50 characters or less'),
  name: z.string().trim().min(1, 'Category name is required').max(50, 'Category name must be 50 characters or less'),
  displayOrder: z.number().int('Display order must be an integer').nonnegative('Display order must be non-negative'),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Category {
  id: number;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  itemCount: number;
}

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Category, 'id' | 'itemCount'> & { id?: number }) => void;
  initialData: Category | null;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditMode = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      code: '',
      name: '',
      displayOrder: 0,
      isActive: true,
    },
  });

  // Reset form with initial data when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          code: initialData.code || '',
          name: initialData.name,
          displayOrder: initialData.displayOrder,
          isActive: initialData.isActive,
        });
      } else {
        reset({
          code: '',
          name: '',
          displayOrder: 0,
          isActive: true,
        });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (values: CategoryFormValues) => {
    onSave({
      ...values,
      id: initialData?.id,
    });
    onClose();
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
            p: 1.5,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {isEditMode ? 'Edit Category' : 'Add Category'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Category Code */}
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Code"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  disabled={isEditMode}
                  autoFocus={!isEditMode}
                />
              )}
            />

            {/* Category Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Name"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  autoFocus={isEditMode}
                />
              )}
            />

            {/* Display Order */}
            <Controller
              name="displayOrder"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Display Order"
                  type="number"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!errors.displayOrder}
                  helperText={errors.displayOrder?.message}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Number(e.target.value);
                    field.onChange(val);
                  }}
                  value={field.value}
                />
              )}
            />

            {/* Active Status */}
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Active Status
                    </Typography>
                  }
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
