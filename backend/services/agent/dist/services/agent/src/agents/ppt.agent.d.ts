export interface PptAgentParams {
    [key: string]: any;
}
export declare const pptAgent: (params: PptAgentParams) => Promise<{
    success: boolean;
    message: string;
}>;
