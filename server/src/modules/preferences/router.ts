import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { addToWatchlistSchema } from './schemas';
import * as prefService from './service';

const router = Router();
router.use(authenticate);

router.get('/:profileId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await prefService.getWatchlist(req.params.profileId as string);
    res.json(list);
  } catch (err) { next(err); }
});

router.post(
  '/',
  validate(addToWatchlistSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await prefService.addToWatchlist(req.body.profileId, req.body.videoTitle);
      res.status(201).json(item);
    } catch (err) { next(err); }
  },
);

router.delete('/:profileId/:videoTitle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prefService.removeFromWatchlist(
      req.params.profileId as string,
      decodeURIComponent(req.params.videoTitle as string),
    );
    res.status(204).send();
  } catch (err) { next(err); }
});

router.delete('/:profileId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prefService.removeAllByProfile(req.params.profileId as string);
    res.status(204).send();
  } catch (err) { next(err); }
});

router.get('/:profileId/check/:videoTitle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inList = await prefService.isInWatchlist(
      req.params.profileId as string,
      decodeURIComponent(req.params.videoTitle as string),
    );
    res.json({ inList });
  } catch (err) { next(err); }
});

export default router;
