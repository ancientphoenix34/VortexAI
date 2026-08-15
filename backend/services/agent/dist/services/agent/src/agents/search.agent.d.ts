export interface SearchAgentParams {
    [key: string]: any;
}
export declare const searchAgent: (params: SearchAgentParams) => Promise<{
    success: boolean;
    message: string;
}>;
