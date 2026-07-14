import React, { useState, useMemo } from 'react';
import { Box, Paper, Button, Snackbar, Alert, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';
import { menuItemApi } from '../../api/menuItemApi';
import { POSHeader } from '../../modules/pos/components/POSHeader';
import { CategorySidebar } from '../../modules/pos/components/CategorySidebar';
import { MenuGrid } from '../../modules/pos/components/MenuGrid';
import { OrderType } from '../../modules/pos/components/OrderType';
import { Cart } from '../../modules/pos/components/Cart';
import { PaymentMode } from '../../modules/pos/components/PaymentMode';
import { OrderSummary } from '../../modules/pos/components/OrderSummary';
import { CheckoutSuccessDialog } from '../../modules/pos/components/CheckoutSuccessDialog';
import { useCart } from '../../modules/pos/hooks/useCart';
import { useCheckout } from '../../modules/pos/hooks/useCheckout';
import type { Category } from '../../api/categoryApi';
import type { MenuItem } from '../../api/menuItemApi';
import type { CheckoutResponseData } from '../../modules/pos/api/checkoutApi';

export const POSPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'All'>('All');
  const navigate = useNavigate();
  
  // Use the custom useCart hook containing all states and business formulas
  const {
    cart,
    discount,
    discountType,
    paymentMode,
    orderType,
    subtotal,
    gst,
    total,
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    setDiscount,
    setDiscountType,
    setPaymentMode,
    setOrderType,
  } = useCart();

  // Snackbar Notification State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Success Dialog State
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutResponseData | null>(null);

  // Queries
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const { data: menuItems = [], isLoading: isMenuItemsLoading } = useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: menuItemApi.getAll, // Load all items to display both available and unavailable
  });

  // Filter menu items by selected category
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      return selectedCategoryId === 'All' || item.categoryId === selectedCategoryId;
    });
  }, [menuItems, selectedCategoryId]);

  // Hook up useCheckout Mutation
  const { mutate: performCheckout, isPending: isCheckoutPending } = useCheckout({
    onSuccess: (data) => {
      setCheckoutData(data);
      setSuccessDialogOpen(true);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || 'Checkout failed';
      setSnackbarSeverity('error');
      setSnackbarMessage(msg);
      setSnackbarOpen(true);
    },
  });

  // Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const payload = {
      orderType,
      paymentMode,
      discountType: (discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'AMOUNT') as 'PERCENTAGE' | 'AMOUNT',
      discountValue: discount,
      items: cart.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
    };

    // Trigger API mutation
    performCheckout(payload);
  };

  const handleNewOrder = () => {
    clearCart();
    setPaymentMode('CASH');
    setDiscount(0);
    setSuccessDialogOpen(false);
  };

  const handleViewOrder = () => {
    if (checkoutData?.billId) {
      setSuccessDialogOpen(false);
      clearCart();
      navigate(`/orders/${checkoutData.billId}`);
    }
  };

  const orderForPrinting = checkoutData ? {
    billHeader: {
      billId: checkoutData.billId,
      billNumber: checkoutData.billNumber,
      createdAt: checkoutData.createdAt,
      orderType: checkoutData.orderType,
      paymentMode: checkoutData.paymentMode,
      status: 'COMPLETED',
    },
    billItems: checkoutData.items.map((item) => {
      const cartItem = cart.find((c) => c.menuItemId === item.menuItemId);
      return {
        id: item.menuItemId,
        menuItemId: item.menuItemId,
        name: cartItem ? cartItem.name : `Item #${item.menuItemId}`,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.total),
      };
    }),
    subtotal: Number(checkoutData.subtotal),
    discount: Number(checkoutData.discount),
    gst: Number(checkoutData.gst),
    grandTotal: Number(checkoutData.grandTotal),
    restaurant: {
      name: 'MYQSR Express',
      address: '123 Food Street, Tech Park, Hyderabad',
      phone: '+91 98765 43210',
      footerMessage: 'Thank you for dining with us! Please visit again.',
    },
  } : null;

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header containing date and time only */}
      <POSHeader />

      <Grid container spacing={3} sx={{ flexGrow: 1, height: 'calc(100% - 40px)' }}>
        {/* LEFT COLUMN: Categories vertical sidebar (~15% width) */}
        <Grid size={{ xs: 12, sm: 2.5, md: 1.8 }} sx={{ height: '100%' }}>
          <CategorySidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </Grid>

        {/* CENTER COLUMN: Menu Item grid cards (~50% width) */}
        <Grid size={{ xs: 12, sm: 5.5, md: 6.7 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
            <MenuGrid
              items={filteredItems}
              onAddItem={addItem}
              isLoading={isCategoriesLoading || isMenuItemsLoading}
            />
          </Box>
        </Grid>

        {/* RIGHT COLUMN: Cart details, summary, and action triggers (~35% width) */}
        <Grid size={{ xs: 12, sm: 4, md: 3.5 }} sx={{ height: '100%' }}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              p: 3,
              borderRadius: '16px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none',
            }}
          >
            {/* Order type tabs */}
            <OrderType orderType={orderType} onOrderTypeChange={setOrderType} />

            {/* Cart Row Items (occupies most of the vertical space) */}
            <Cart
              items={cart}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeItem}
            />

            <Divider sx={{ my: 1.5 }} />

            {/* Order summary calculations */}
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              onDiscountChange={setDiscount}
              discountType={discountType}
              onDiscountTypeChange={setDiscountType}
              gst={gst}
              total={total}
              disabled={cart.length === 0}
            />

            {/* Payment Mode Selection */}
            <PaymentMode
              paymentMode={paymentMode}
              onPaymentModeChange={setPaymentMode}
              disabled={cart.length === 0}
            />

            {/* Operations buttons */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={cart.length === 0 || isCheckoutPending}
                onClick={handleCheckout}
                sx={{
                  py: 1.2,
                  borderRadius: '10px',
                  fontWeight: 700,
                  boxShadow: 'none',
                }}
              >
                Checkout
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                disabled={cart.length === 0 || isCheckoutPending}
                onClick={clearCart}
                sx={{
                  py: 1.2,
                  borderRadius: '10px',
                  fontWeight: 700,
                }}
              >
                Clear Cart
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Checkout Success Modal Popup */}
      <CheckoutSuccessDialog
        open={successDialogOpen}
        data={checkoutData}
        onNewOrder={handleNewOrder}
        onViewOrder={handleViewOrder}
        orderForPrinting={orderForPrinting}
      />

      {/* Snackbar alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
