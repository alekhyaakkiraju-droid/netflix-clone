import { Router } from 'express';

const router = Router();

// Stub — implemented in subsequent WOs
router.get('/ping', (_req, res) => res.json({ module: 'profiles', status: 'stub' }));

export default router;
