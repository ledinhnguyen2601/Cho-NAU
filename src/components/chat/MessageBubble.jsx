import React from 'react';
import { formatMessageTime } from '../../utils/formatters';
import { CheckCheck } from 'lucide-react';

export const MessageBubble = ({ message, isMe }) => {
  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3`}>
      <div
        className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
          isMe
            ? 'bg-nau-primary text-white rounded-br-xs'
            : 'bg-nau-surface dark:bg-nau-surface text-nau-text dark:text-nau-text border border-nau-border dark:border-nau-border rounded-bl-xs'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>

      <div className={`flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1`}>
        <span>{formatMessageTime(message.timestamp)}</span>
        {isMe && (
          <CheckCheck className={`w-3 h-3 ${message.read ? 'text-nau-primary' : 'text-slate-400'}`} />
        )}
      </div>
    </div>
  );
};
