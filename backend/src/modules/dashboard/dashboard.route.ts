import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticateJWT } from '../../shared/middleware/auth.middleware';

const router = Router();
const controller = new DashboardController();

// GET /api/v1/dashboard - Secured owner dashboard calculations
router.get('/', authenticateJWT, controller.getDashboardData);

export default router;
