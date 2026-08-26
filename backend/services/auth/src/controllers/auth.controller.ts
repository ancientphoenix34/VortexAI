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
    await redis.set(`user-session-${user._id}`,sessionId,"EX",7*24*60*60);
    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      'EX',
      7 * 24 * 60 * 60
    );

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

export const updateUserPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { plan, credits, userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.plan = plan;
    user.credits = (user.credits || 0) + Number(credits);
    user.totalCredits = (user.totalCredits || 0) + Number(credits);
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await user.save();

    const sessionId = await redis.get(`user-session-${user?._id}`) ||  req.cookies?.session;

    if (sessionId) {
      await redis.set(
        `session-${sessionId}`,
        JSON.stringify({
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt,
        }),
        'EX',
        7 * 24 * 60 * 60
      );
    }

    return res.status(200).json({ success: true, message: 'plan update successful' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const deductCredits = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, agent } = req.body;

    const COST: Record<string, number> = {
      chat: 1,
      search: 5,
      coding: 10,
      pdf: 10,
      ppt: 10,
      vision: 10,
      "pdf-rag": 12,
      "image-analyzer": 12,
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const requiredCredits = COST[agent] || 1;

    if ((user.credits ?? 0) < requiredCredits) {
      return res.status(400).json({ message: 'Not enough credits' });
    }

    user.credits = (user.credits ?? 0) - requiredCredits;
    await user.save();

    const sessionId = (await redis.get(`user-session-${user._id}`)) || req.cookies?.session;

    if (sessionId) {
      await redis.set(
        `session-${sessionId}`,
        JSON.stringify({
          userId: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiresAt: user.planExpiresAt,
        }),
        'EX',
        7 * 24 * 60 * 60
      );
    }

    return res.status(200).json({ success: true, message: 'Credits deducted successfully', credits: user.credits });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};



