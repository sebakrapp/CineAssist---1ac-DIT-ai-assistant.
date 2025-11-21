import React from 'react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { CameraIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isUser ? 'bg-white text-black' : 'bg-cinema-accent text-white'}
        `}>
            {isUser ? (
                <span className="text-xs font-bold">AC</span>
            ) : (
                <CameraIcon width={16} height={16} />
            )}
        </div>

        {/* Content Bubble */}
        <div className={`
            flex flex-col p-4 rounded-2xl 
            ${isUser 
                ? 'bg-cinema-panel border border-gray-800 text-white rounded-tr-none' 
                : 'bg-black border border-gray-800 text-gray-100 rounded-tl-none shadow-lg'
            }
        `}>
            {/* User Image Display */}
            {message.image && (
                <div className="mb-3">
                    <img 
                        src={message.image} 
                        alt="User upload" 
                        className="rounded-lg max-w-full max-h-60 object-contain border border-gray-700"
                    />
                </div>
            )}

            <MarkdownRenderer content={message.content} />
            
            {/* Sources (Grounding) */}
            {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-wider">Sources</p>
                    <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, idx) => (
                            <a 
                                key={idx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-cinema-arri hover:underline truncate max-w-[200px] bg-gray-900 px-2 py-1 rounded"
                            >
                                {source.title}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Timestamp */}
            <span className="text-[10px] text-gray-600 mt-2 self-end font-mono">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;