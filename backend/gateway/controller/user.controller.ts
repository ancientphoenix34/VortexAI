import { Request, Response } from 'express';

export const getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json(req.user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
