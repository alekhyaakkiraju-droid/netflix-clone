import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { createProfileSchema, updateProfileSchema } from './schemas';
import * as profileService from './service';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profiles = await profileService.getProfilesByUser(req.user!.userId);
    res.json(profiles);
  } catch (err) { next(err); }
});

router.post(
  '/',
  validate(createProfileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.createProfile(req.user!.userId, req.body);
      res.status(201).json(profile);
    } catch (err) { next(err); }
  },
);

router.get('/:profileId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.getProfileById(req.params.profileId, req.user!.userId);
    res.json(profile);
  } catch (err) { next(err); }
});

router.put(
  '/:profileId',
  validate(updateProfileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.updateProfile(
        req.params.profileId,
        req.user!.userId,
        req.body,
      );
      res.json(profile);
    } catch (err) { next(err); }
  },
);

router.delete('/:profileId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await profileService.deleteProfile(req.params.profileId, req.user!.userId);
    res.status(204).send();
  } catch (err) { next(err); }
});

// Validation helpers (used by frontend inline checks)
router.get('/validate/name/:profileName', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAvailable = await profileService.validateProfileName(
      req.user!.userId,
      req.params.profileName,
    );
    res.json({ available: isAvailable });
  } catch (err) { next(err); }
});

router.get('/validate/handle/:gameHandle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAvailable = await profileService.validateGameHandle(req.params.gameHandle);
    res.json({ available: isAvailable });
  } catch (err) { next(err); }
});

export default router;
