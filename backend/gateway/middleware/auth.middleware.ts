import { Request, Response, NextFunction } from 'express';
import redis from '../../shared/redis/redis.js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(400).json({ message: 'unauthorized' });
    }

    const session = await redis.get(`session-${sessionId}`);

    if (!session) {
      return res.status(400).json({ message: 'session expired' });
    }

    req.user = JSON.parse(session);

    next();
  } catch (error: any) {
    console.error('Error in protect middleware:', error);
    return res.status(500).json({ message: ` protect error - ${error.message}`});
  }
};

export default protect
