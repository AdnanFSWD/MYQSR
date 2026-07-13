import { useState, useMemo, useEffect } from 'react';
import type { MenuItem } from '../../../api/menuItemApi';

export interface CartItemData {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type DiscountType = 'PERCENTAGE' | 'FIXED';
export type PaymentModeType = 'CASH' | 'UPI' | 'CARD';
export type OrderTypeType = 'DINE_IN' | 'TAKE_AWAY';

export const useCart = () => {
  const [cart, setCart] = useState<CartItemData[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<DiscountType>('FIXED');
  const [paymentMode, setPaymentMode] = useState<PaymentModeType>('CASH');
  const [orderType, setOrderType] = useState<OrderTypeType>('DINE_IN');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // 1. Add Item to Cart
  const addItem = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          image: item.image || 'burger.svg',
        },
      ];
    });
  };

  // 2. Increase Quantity
  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.menuItemId === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // 3. Decrease Quantity
  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.menuItemId === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 4. Remove Item
  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.menuItemId !== id));
  };

  // 5. Clear Cart
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setDiscountType('FIXED');
    setPaymentMode('CASH');
    setOrderType('DINE_IN');
    setTableNumber('');
    setCustomerName('');
    setPhoneNumber('');
  };

  // 6. Pricing Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === 'PERCENTAGE') {
      const amt = (subtotal * discount) / 100;
      return Math.min(amt, subtotal);
    }
    return Math.min(discount, subtotal);
  }, [subtotal, discount, discountType]);

  const gst = useMemo(() => {
    const net = Math.max(subtotal - discountAmount, 0);
    return net * 0.05; // 5% GST
  }, [subtotal, discountAmount]);

  const total = useMemo(() => {
    const net = Math.max(subtotal - discountAmount, 0);
    return net + gst;
  }, [subtotal, discountAmount, gst]);

  // Adjust discount when subtotal changes (to avoid discount exceeding subtotal)
  useEffect(() => {
    if (discountType === 'FIXED' && discount > subtotal) {
      setDiscount(subtotal);
    } else if (discountType === 'PERCENTAGE' && discount > 100) {
      setDiscount(100);
    }
  }, [subtotal, discount, discountType]);

  return {
    cart,
    discount,
    discountType,
    paymentMode,
    orderType,
    tableNumber,
    customerName,
    phoneNumber,
    subtotal,
    discountAmount,
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
    setTableNumber,
    setCustomerName,
    setPhoneNumber,
  };
};
