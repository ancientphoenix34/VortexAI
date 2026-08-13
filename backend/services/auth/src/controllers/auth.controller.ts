import { Request, Response, CookieOptions } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { app } from '../config/firebase.js';
import User, { IUser } from '../models/user.model.js';
import crypto from 'crypto';
import redis from '../../../../shared/redis/redis.js';

interface LoginRequestBody {
  token: string;
}

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    const sessionId = crypto.randomUUID();
    await redis.set(`session-${sessionId}`,
      JSON.stringify({userId:user._id,
        name:user.name,
        email:user.email,
        avatar:user.avatar
      }),"EX",7 * 24 * 60 * 60);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('session', sessionId, cookieOptions);

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const logOut = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session-${sessionId}`);
    }

    res.clearCookie('session');

    return res.status(200).json({ message: 'logout successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

