import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authenticateJWT } from '../../shared/middleware/auth.middleware';

const router = Router();
const controller = new OrdersController();

// GET /api/v1/orders - Paginated list of orders
router.get('/', authenticateJWT, controller.getOrders);

// GET /api/v1/orders/:id - Get detailed order by ID
router.get('/:id', authenticateJWT, controller.getOrderById);

// PATCH /api/v1/orders/:id/cancel - Cancel order
router.patch('/:id/cancel', authenticateJWT, controller.cancelOrder);

export default router;
