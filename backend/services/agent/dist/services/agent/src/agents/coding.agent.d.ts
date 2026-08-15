export interface CodingAgentParams {
    [key: string]: any;
}
export declare const codingAgent: (params: CodingAgentParams) => Promise<{
    success: boolean;
    message: string;
}>;
