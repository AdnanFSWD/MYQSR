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
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const AVAILABLE_IMAGES = ['burger.svg', 'fries.svg', 'drink.svg', 'dessert.svg'];

// Zod validation schema for MenuItem
const menuItemSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  shortCode: z.string().trim().min(1, 'Short code is required').max(10, 'Short code must be 10 characters or less'),
  description: z.string().trim().max(500, 'Description must be 500 characters or less').optional().nullable(),
  price: z.number().positive('Price must be a positive number'),
  image: z.string().trim().min(1, 'Image is required'),
  isAvailable: z.boolean(),
  displayOrder: z.number().int('Display order must be an integer').nonnegative('Display order must be non-negative'),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface Category {
  id: string;
  name: string;
}

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

interface MenuItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<MenuItemData, 'id'> & { id?: string }) => void;
  initialData: MenuItemData | null;
  categories: Category[];
}

export const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  categories,
}) => {
  const isEditMode = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      categoryId: '',
      name: '',
      shortCode: '',
      description: '',
      price: 0,
      image: 'burger.svg',
      isAvailable: true,
      displayOrder: 0,
    },
  });

  const selectedImage = watch('image');

  // Load initial data
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          categoryId: initialData.categoryId,
          name: initialData.name,
          shortCode: initialData.shortCode,
          description: initialData.description || '',
          price: initialData.price,
          image: initialData.image || 'burger.svg',
          isAvailable: initialData.isAvailable,
          displayOrder: initialData.displayOrder,
        });
      } else {
        reset({
          categoryId: '',
          name: '',
          shortCode: '',
          description: '',
          price: 0.00,
          image: 'burger.svg',
          isAvailable: true,
          displayOrder: 0,
        });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (values: MenuItemFormValues) => {
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
      maxWidth="sm"
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
        {isEditMode ? 'Edit Menu Item' : 'Add Menu Item'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Category Autocomplete */}
            <Controller
              name="categoryId"
              control={control}
              render={({ field: { onChange, value } }) => {
                const selectedCat = categories.find((cat) => cat.id === value) || null;
                return (
                  <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, val) => option.id === val.id}
                    value={selectedCat}
                    onChange={(_, newValue) => {
                      onChange(newValue ? newValue.id : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        size="small"
                        error={!!errors.categoryId}
                        helperText={errors.categoryId?.message}
                      />
                    )}
                  />
                );
              }}
            />

            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Menu Item Name"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            {/* Short Code & Price Row */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Controller
                name="shortCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Short Code"
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={!!errors.shortCode}
                    helperText={errors.shortCode?.message}
                  />
                )}
              />

              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Price ($)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(val);
                    }}
                    value={field.value}
                  />
                )}
              />
            </Box>

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (Optional)"
                  multiline
                  rows={2}
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  value={field.value || ''}
                />
              )}
            />

            {/* Image Selection & Preview */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.image}>
                    <InputLabel id="image-label">Image filename</InputLabel>
                    <Select
                      {...field}
                      labelId="image-label"
                      label="Image filename"
                    >
                      {AVAILABLE_IMAGES.map((img) => (
                        <MenuItem key={img} value={img}>
                          {img}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.image && <FormHelperText>{errors.image.message}</FormHelperText>}
                  </FormControl>
                )}
              />

              {/* Dynamic Image Preview */}
              {selectedImage && (
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'action.hover',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={`/images/menu/${selectedImage}`}
                    alt="Preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>

            {/* Display Order & Availability Switch */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Controller
                name="displayOrder"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Display Order"
                    type="number"
                    variant="outlined"
                    size="small"
                    error={!!errors.displayOrder}
                    helperText={errors.displayOrder?.message}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(val);
                    }}
                    value={field.value}
                    sx={{ width: 150 }}
                  />
                )}
              />

              <Controller
                name="isAvailable"
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
                        Available status
                      </Typography>
                    }
                  />
                )}
              />
            </Box>
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
