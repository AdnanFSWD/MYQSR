import { Router } from 'express';
import { SalesController } from './sales.controller';
import { authenticateJWT } from '../../shared/middleware/auth.middleware';

const router = Router();
const controller = new SalesController();

// GET /api/v1/sales/bills - Paginated list of bills
router.get('/bills', authenticateJWT, controller.getBills);

// GET /api/v1/sales/bills/:billId - Get detailed bill by ID
router.get('/bills/:billId', authenticateJWT, controller.getBillById);

// PATCH /api/v1/sales/bills/:billId/cancel - Cancel bill
router.patch('/bills/:billId/cancel', authenticateJWT, controller.cancelBill);

export default router;
