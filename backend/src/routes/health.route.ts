import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/health
 * 
 * Simple health check endpoint to verify that the backend is up and running.
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'QSR Backend Running',
  });
});

export default router;
