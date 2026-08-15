import { StateGraph } from '@langchain/langgraph';
export declare const workflow: StateGraph<import("@langchain/langgraph").AnnotationRoot<{
    prompt: import("@langchain/langgraph").LastValue<string>;
    aiResponse: import("@langchain/langgraph").LastValue<string>;
    agent: import("@langchain/langgraph").LastValue<string>;
}>, import("@langchain/langgraph").StateType<{
    prompt: import("@langchain/langgraph").LastValue<string>;
    aiResponse: import("@langchain/langgraph").LastValue<string>;
    agent: import("@langchain/langgraph").LastValue<string>;
}>, import("@langchain/langgraph").UpdateType<{
    prompt: import("@langchain/langgraph").LastValue<string>;
    aiResponse: import("@langchain/langgraph").LastValue<string>;
    agent: import("@langchain/langgraph").LastValue<string>;
}>, "__start__" | "chat" | "coding" | "pdf" | "ppt" | "router" | "search" | "vision", {
    prompt: import("@langchain/langgraph").LastValue<string>;
    aiResponse: import("@langchain/langgraph").LastValue<string>;
    agent: import("@langchain/langgraph").LastValue<string>;
}, {
    prompt: import("@langchain/langgraph").LastValue<string>;
    aiResponse: import("@langchain/langgraph").LastValue<string>;
    agent: import("@langchain/langgraph").LastValue<string>;
}, import("@langchain/langgraph").StateDefinition, {
    chat: {
        prompt: string;
        agent: string;
        aiResponse: string;
    };
    coding: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
    pdf: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
    ppt: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
    router: {
        prompt: string;
        aiResponse: string;
        agent: string;
    };
    search: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
    vision: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
}, unknown, unknown>;
export declare const graph: import("@langchain/langgraph").CompiledStateGraph<{
    prompt: string;
    aiResponse: string;
    agent: string;
}, {
    prompt?: string | undefined;
    aiResponse?: string | undefined;
    agent?: string | undefined;
}, "__start__" | "chat" | "coding" | "pdf" | "ppt" | "router" | "search" | "vision", {
    prompt: import("@langchain/langgraph").LastValue<string>;
    aiResponse: import("@langchain/langgraph").LastValue<string>;
    agent: import("@langchain/langgraph").LastValue<string>;
}, {
    prompt: import("@langchain/langgraph").LastValue<string>;
    aiResponse: import("@langchain/langgraph").LastValue<string>;
    agent: import("@langchain/langgraph").LastValue<string>;
}, import("@langchain/langgraph").StateDefinition, {
    chat: {
        prompt: string;
        agent: string;
        aiResponse: string;
    };
    coding: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
    pdf: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
    ppt: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
    router: {
        prompt: string;
        aiResponse: string;
        agent: string;
    };
    search: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
    vision: import("@langchain/langgraph").UpdateType<{
        prompt: import("@langchain/langgraph").LastValue<string>;
        aiResponse: import("@langchain/langgraph").LastValue<string>;
        agent: import("@langchain/langgraph").LastValue<string>;
    }>;
}, unknown, unknown, []>;
