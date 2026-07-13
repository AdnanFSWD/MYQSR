import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authenticateJWT } from '../../shared/middleware/auth.middleware';

const router = Router();
const controller = new SettingsController();

// GET /api/v1/settings - Fetch configurations
router.get('/', authenticateJWT, controller.getSettings);

// PUT /api/v1/settings - Update configurations
router.put('/', authenticateJWT, controller.updateSettings);

export default router;
