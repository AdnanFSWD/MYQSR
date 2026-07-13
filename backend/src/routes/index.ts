import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from '../modules/auth/auth.route';
import categoryRouter from '../modules/menu/category/category.route';
import menuItemRouter from '../modules/menu/menuItem/menuItem.route';
import posRouter from '../modules/pos/checkout/pos.route';
import salesRouter from '../modules/sales/sales.route';
import ordersRouter from '../modules/orders/orders.route';
import dashboardRouter from '../modules/dashboard/dashboard.route';
import settingsRouter from '../modules/settings/settings.route';
import { authenticateJWT } from '../shared/middleware/auth.middleware';

const router = Router();
const v1Router = Router();

// 1. Mount auth module (public routes inside like /login, protected inside like /logout, /change-password)
v1Router.use('/auth', authRouter);

// 2. Protect all other v1 APIs with JWT verification
v1Router.use(authenticateJWT);

// 3. Mount protected v1 domain routes
v1Router.use('/categories', categoryRouter);
v1Router.use('/menu-items', menuItemRouter);
v1Router.use('/pos', posRouter);
v1Router.use('/sales', salesRouter);
v1Router.use('/orders', ordersRouter);
v1Router.use('/dashboard', dashboardRouter);
v1Router.use('/settings', settingsRouter);

// Mount routers
router.use('/v1', v1Router);
router.use('/health', healthRouter);

export default router;
