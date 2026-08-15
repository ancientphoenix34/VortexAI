export interface ImageGenAgentParams {
    [key: string]: any;
}
export declare const visionAgent: (params: ImageGenAgentParams) => Promise<{
    success: boolean;
    message: string;
}>;
