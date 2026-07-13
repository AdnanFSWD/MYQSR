import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticateJWT } from '../../shared/middleware/auth.middleware';
import { loginSchema, changePasswordSchema } from './auth.validation';

const router = Router();
const controller = new AuthController();

// POST /api/v1/auth/login - Public login endpoint
router.post('/login', validate(loginSchema), controller.login);

// POST /api/v1/auth/logout - Protected logout endpoint
router.post('/logout', authenticateJWT, controller.logout);

// POST /api/v1/auth/change-password - Protected password update endpoint
router.post('/change-password', authenticateJWT, validate(changePasswordSchema), controller.changePassword);

export default router;
