import React from 'react';
import {
  Paper,
  Stack,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Today as TodayIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface OrdersToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  paymentFilter: string;
  onPaymentChange: (val: string) => void;
  orderTypeFilter: string;
  onOrderTypeChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  dateFilter: string;
  onDateChange: (val: string) => void;
  showTodayOnly: boolean;
  onTodayOnlyChange: (val: boolean) => void;
  onClear: () => void;
}

export const OrdersToolbar: React.FC<OrdersToolbarProps> = ({
  searchQuery,
  onSearchChange,
  paymentFilter,
  onPaymentChange,
  orderTypeFilter,
  onOrderTypeChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  showTodayOnly,
  onTodayOnlyChange,
  onClear,
}) => {
  const theme = useTheme();

  const isFiltered =
    searchQuery ||
    paymentFilter !== 'ALL' ||
    orderTypeFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    dateFilter ||
    showTodayOnly;

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: '12px', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
        {/* Today's bills toggle button */}
        <Button
          variant={showTodayOnly ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => onTodayOnlyChange(!showTodayOnly)}
          startIcon={<TodayIcon />}
          sx={{ borderRadius: '8px', py: 0.8, textTransform: 'none', fontWeight: 700, flexShrink: 0 }}
        >
          Today's Orders
        </Button>

        {/* Date filter field */}
        <TextField
          type="date"
          size="small"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={showTodayOnly}
          sx={{
            width: { xs: '100%', sm: 160 },
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
        />

        {/* Payment Mode select filter */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
          <InputLabel id="payment-filter-label">Payment</InputLabel>
          <Select
            labelId="payment-filter-label"
            value={paymentFilter}
            label="Payment"
            onChange={(e) => onPaymentChange(e.target.value)}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="ALL">All Payments</MenuItem>
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="CARD">Card</MenuItem>
          </Select>
        </FormControl>

        {/* Order Type Filter */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
          <InputLabel id="type-filter-label">Type</InputLabel>
          <Select
            labelId="type-filter-label"
            value={orderTypeFilter}
            label="Type"
            onChange={(e) => onOrderTypeChange(e.target.value)}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="ALL">All Types</MenuItem>
            <MenuItem value="DINE_IN">Dine In</MenuItem>
            <MenuItem value="TAKE_AWAY">Take Away</MenuItem>
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => onStatusChange(e.target.value)}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>

        {/* Search bill number field */}
        <TextField
          placeholder="Search bill number..."
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            flexGrow: 1,
            width: '100%',
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon color="action" fontSize="small" sx={{ mr: 1 }} />,
            },
          }}
        />

        {/* Reset Filters action */}
        {isFiltered && (
          <Tooltip title="Clear all filters">
            <IconButton onClick={onClear} color="inherit">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Paper>
  );
};
