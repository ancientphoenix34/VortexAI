import React, { useState, useRef } from 'react'
import { Paperclip, Mic, Send, Zap, MessageSquare, Code2, FileText, Presentation, Image, Globe, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../features/sendMessage'
import { addMessage, setArtifacts, setMessages, setIsLoading } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setSelectedConversation, setConvTitle } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'

const ChatInput = () => {
    const [value, setValue] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("Auto");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const { selectedConversation } = useSelector((state: any) => state.conversation);
    const { isLoading } = useSelector((state: any) => state.message);
    const dispatch = useDispatch();

    const agents = [
        { id: 'auto', icon: Zap, label: 'Auto' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'coding', icon: Code2, label: 'Coding' },
        { id: 'pdf', icon: FileText, label: 'PDF' },
        { id: 'ppt', icon: Presentation, label: 'PPT' },
        { id: 'vision', icon: Image, label: 'Vision' },
        { id: 'search', icon: Globe, label: 'Search' },
    ];

    const handleSendMessage = async () => {
        let conversation = selectedConversation;

        if (!selectedConversation) {
            const conv = await createConversation();
            dispatch(setSelectedConversation(conv))
            dispatch(addConversation(conv))
            dispatch(setMessages([]))
            conversation = conv;
        }

        if (conversation.title == "New Chat") {
            await updateConversation({ id: conversation?._id, title: value.trim() })
            dispatch(setConvTitle({ title: value.trim().slice(0, 40) + "...", conversationId: conversation?._id }))
        }
        if (!value.trim()) return;
        const formData = new FormData();
        formData.append("prompt", value.trim());
        formData.append("conversationId", conversation?._id);
        formData.append("agent", selectedAgent.toLowerCase());
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        dispatch(addMessage({ role: "user", content: value.trim() }));
        dispatch(setIsLoading(true));
        setValue("");
        setSelectedFile(null);
        if (fileRef.current) fileRef.current.value = "";

        try {
            const data = await sendMessage(formData);
            dispatch(setArtifacts(data?.artifacts || []))
            if (data?.response) {
                dispatch(addMessage({ role: "assistant", content: data.response, images: data.images, artifacts: data.artifacts }));
            }
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    return (
        <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]'>
            <div className='flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>
                <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>
                    {agents.map((agent) => {
                        const isActive = selectedAgent === agent.label
                        const Icon = agent.icon
                        return (
                            <div
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent.label)}
                                className={`flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${isActive
                                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                                    }`}
                            >
                                <Icon size={14} className={isActive ? "text-white" : "text-slate-500"} />
                                <span>{agent.label}</span>
                            </div>
                        )
                    })}
                </div>

                {selectedFile && (
                    <div className='my-3'>
                        <div className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2'>
                            {selectedFile?.type === "application/pdf" ? (
                                <FileText size={16} className="text-red-400" />
                            ) : selectedFile?.type.startsWith("image/") ? (
                                <img src={URL.createObjectURL(selectedFile)} alt="preview" className="h-10 w-10 rounded-xl object-cover mt-3" />
                            ) : null}
                            <div>
                                <p className='text-xs text-white max-w-[180px] truncate'>
                                    {selectedFile?.name}
                                </p>
                                <p className='text-[10px] text-slate-500'>
                                    {Math.ceil((selectedFile?.size || 0) / 1024)} KB
                                </p>
                            </div>
                            <button
                                className='ml-2 cursor-pointer'
                                onClick={() => {
                                    setSelectedFile(null);
                                    if (fileRef.current) fileRef.current.value = "";
                                }}
                            >
                                <X size={14} className='text-slate-500 hover:text-white transition-colors' />
                            </button>
                        </div>
                    </div>
                )}
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder='Ask Anything...'
                    className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
                    rows={3}
                />
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            hidden
                            ref={fileRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedFile(file);
                                }
                            }}
                        />
                        <button
                            onClick={() => fileRef.current?.click()}
                            className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'
                        >
                            <Paperclip size={16} />
                        </button>
                        <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'>
                            <Mic size={16} />
                        </button>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!value.trim() || isLoading}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() && !isLoading ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white" : "bg-white/[0.05] text-slate-600 cursor-not-allowed"}`}
                    >
                        <Send size={15} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatInput
