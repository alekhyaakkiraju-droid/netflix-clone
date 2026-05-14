import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import * as videoService from './service';

const router = Router();
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const videos = await videoService.getAllVideos(q);
    res.json(videos);
  } catch (err) { next(err); }
});

router.get('/suggestions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const suggestions = await videoService.getSuggestions(limit);
    res.json(suggestions);
  } catch (err) { next(err); }
});

router.get('/genre/:genre', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const videos = await videoService.getVideosByGenre(req.params.genre as string);
    res.json(videos);
  } catch (err) { next(err); }
});

router.get('/:title', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await videoService.getVideoByTitle(decodeURIComponent(req.params.title as string));
    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }
    res.json(video);
  } catch (err) { next(err); }
});

export default router;
