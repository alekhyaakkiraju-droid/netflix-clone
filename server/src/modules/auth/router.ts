import { Router } from 'express';

const router = Router();

// Stub — implemented in subsequent WOs
router.get('/ping', (_req, res) => res.json({ module: 'auth', status: 'stub' }));

export default router;
