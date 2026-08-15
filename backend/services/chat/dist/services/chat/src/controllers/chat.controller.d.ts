import { Request, Response } from 'express';
export declare const createConversation: (req: Request, res: Response) => Promise<void>;
export declare const getConversation: (req: Request, res: Response) => Promise<void>;
export declare const getConversations: typeof getConversation;
export declare const updateConversation: (req: Request, res: Response) => Promise<void>;
export declare const saveMessage: (req: Request, res: Response) => Promise<void>;
export declare const getMessages: (req: Request, res: Response) => Promise<void>;
