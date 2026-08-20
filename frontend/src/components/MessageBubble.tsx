import Markdown from 'react-markdown';

const MessageBubble = ({ role, content, images }: { role: string, content: string, images?: any }) => {
    const isUser = role === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl break-words overflow-hidden text-[13.5px] leading-relaxed ${
                isUser
                    ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
                    : "text-slate-200 rounded-tl-sm"
            }`}>
                {images?.length > 0 && (
                    <div className='flex flex-wrap gap-3 mt-4'>
                        {images.map((img: string, i: number) => (
                            <img
                                key={i}
                                src={img}
                                loading="lazy"
                                onError={(e) => e.currentTarget.remove()}
                                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                            />
                        ))}
                    </div>
                )}
                <Markdown>
                    {content}
                </Markdown>
            </div>
        </div>
    )
}

export default MessageBubble