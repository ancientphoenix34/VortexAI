export interface PdfAgentParams {
    [key: string]: any;
}
export declare const pdfAgent: (params: PdfAgentParams) => Promise<{
    success: boolean;
    message: string;
}>;
