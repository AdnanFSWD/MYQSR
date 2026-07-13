import { Router } from 'express';
import { CheckoutController } from './checkout.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { checkoutSchema } from './pos.validation';

const router = Router();
const controller = new CheckoutController();

// POST /api/v1/pos/checkout - Complete cart checkout transaction
router.route('/checkout')
  .post(validate(checkoutSchema), controller.checkout);

export default router;
