import { z } from 'zod';
import { PaymentMode, OrderType } from '@prisma/client';

/**
 * Zod validation schema for POS Checkout request
 */
export const checkoutSchema = z.object({
  body: z.object({
    orderType: z.nativeEnum(OrderType, {
      required_error: 'Order type is required (DINE_IN, TAKE_AWAY)',
      invalid_type_error: 'Invalid order type. Must be DINE_IN or TAKE_AWAY',
    }),
    paymentMode: z.nativeEnum(PaymentMode, {
      required_error: 'Payment mode is required (CASH, UPI, CARD)',
      invalid_type_error: 'Invalid payment mode. Must be CASH, UPI, or CARD',
    }),
    discountType: z.enum(['PERCENTAGE', 'AMOUNT'], {
      required_error: 'Discount type is required (PERCENTAGE, AMOUNT)',
      invalid_type_error: 'Invalid discount type. Must be PERCENTAGE or AMOUNT',
    }),
    discountValue: z.number({
      required_error: 'Discount value is required',
    }).min(0, 'Discount value must be a non-negative number'),
    items: z.array(
      z.object({
        menuItemId: z.number({
          required_error: 'Menu Item ID (menuItemId) is required',
        }).int().positive('Invalid Menu Item ID format'),
        quantity: z.number({
          required_error: 'Quantity is required',
        }).int('Quantity must be an integer').positive('Quantity must be greater than zero'),
      }),
      {
        required_error: 'Checkout items array (items) is required',
      }
    ).min(1, 'At least one menu item is required to checkout'),
  }),
});
