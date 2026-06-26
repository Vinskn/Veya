import type { ChatBubbleProps } from '../../types/componentTypes';
import { getAvatarUrl } from '../../utils/getAvatarUrl';

export const ChatBubble = ({ message, sender, position }: ChatBubbleProps) => {
  const isStart = position === 'start';
  const bubbleColorClass = isStart
    ? 'bg-[var(--color-bg-elevated)] border-[1px] border-[var(--color-space-border)] text-[var(--color-text-main)] shadow-[0_0_8px_var(--color-space-glow)]'
    : 'bg-space-purple border-[1px] border-space-violet text-white shadow-[0_0_8px_var(--color-space-purple)]';

  return (
    <div className={`chat ${isStart ? 'chat-start' : 'chat-end'} mb-2`}>
      <div className="chat-image avatar opacity-90 hover:opacity-100 transition-opacity">
        <div className={`w-10 rounded-full border border-space-cyan shadow-[0_0_8px_var(--color-space-cyan)] bg-bg-main`}>
          <img alt="Avatar" src={getAvatarUrl(sender)} />
        </div>
      </div>
      <div className={`chat-header mb-1 text-space-cyan text-xs font-semibold tracking-wide drop-shadow-[0_0_5px_var(--color-space-cyan)]`}>
        {sender}
        <time className="text-[0.65rem] text-text-muted ml-2 font-normal drop-shadow-none">12:45</time>
      </div>
      <div className={`chat-bubble text-sm py-2 px-4 ${bubbleColorClass} rounded-2xl whitespace-pre-wrap`}>{message}</div>
    </div>
  );
};
