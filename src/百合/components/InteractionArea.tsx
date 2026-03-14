import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Send, Settings, Sparkles } from './icons';

interface Message {
  id: string;
  type: 'system' | 'narrative' | 'dialogue' | 'player';
  speaker?: string;
  content: string;
}

export function InteractionArea() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '【系统提示】已进入特殊事件区域：旧校舍走廊。目标角色已出现。'
    },
    {
      id: '2',
      type: 'narrative',
      content: '午后的阳光透过旧校舍破碎的窗户洒在满是灰尘的木地板上。空气中弥漫着陈旧木材和微弱的灰尘气息。'
    },
    {
      id: '3',
      type: 'dialogue',
      speaker: '王城紫音',
      content: '甘织同学，你在这里做什么？这里是禁止进入的区域，作为风纪委员长，我必须对你进行处罚。'
    },
    {
      id: '4',
      type: 'narrative',
      content: '虽然语气严厉，但她的眼神却不自觉地躲闪，白皙的脸颊上泛着不自然的微红。显然，刚才在楼梯角的意外触碰还在影响着她。'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'player',
      content: input
    }]);
    setInput('');
    
    // Simulate LLM response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'narrative',
        content: '你的指尖轻轻划过她百褶裙的边缘。紫音的身体猛地一颤，喉咙里溢出一丝甜腻的轻哼，随即立刻用手捂住嘴，羞愤地瞪着你。'
      }]);
    }, 1000);
  };

  return (
    <main className="flex-1 flex flex-col bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg overflow-hidden relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

      {/* Chat/Story Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900/80 border-t border-white/5 backdrop-blur-xl">
        <div className="flex gap-2 mb-2">
          <ActionButton icon={<Sparkles size={14} />} label="系统提示" />
          <ActionButton icon={<ImageIcon size={14} />} label="场景CG" />
          <ActionButton icon={<Settings size={14} />} label="设置" />
        </div>
        
        <div className="relative flex items-end gap-2 bg-black/50 border border-white/10 rounded-xl p-2 focus-within:border-purple-500/50 transition-colors shadow-inner">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入你的行动或对话... (Enter 发送)"
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-600 resize-none max-h-32 min-h-[44px] py-2 px-3 text-sm custom-scrollbar"
            rows={1}
          />
          <button 
            onClick={handleSend}
            className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim()}
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs px-4 py-1.5 rounded-full tracking-wider flex items-center gap-2">
          <Sparkles size={12} />
          {message.content}
        </div>
      </div>
    );
  }

  if (message.type === 'narrative') {
    return (
      <div className="text-gray-300 leading-relaxed font-serif text-[15px] px-4 py-2">
        {message.content}
      </div>
    );
  }

  if (message.type === 'dialogue') {
    return (
      <div className="flex flex-col gap-1 max-w-[85%]">
        <span className="text-xs font-bold text-pink-400 ml-4">{message.speaker}</span>
        <div className="bg-gray-800/60 border border-white/5 text-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-md text-[15px] leading-relaxed relative group">
          <div className="absolute left-0 top-0 w-1 h-full bg-pink-500/50 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {message.content}
        </div>
      </div>
    );
  }

  if (message.type === 'player') {
    return (
      <div className="flex flex-col items-end gap-1 w-full">
        <span className="text-xs font-bold text-purple-400 mr-4">你</span>
        <div className="bg-purple-900/40 border border-purple-500/30 text-purple-100 p-4 rounded-2xl rounded-tr-sm shadow-md max-w-[85%] text-[15px] leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return null;
}

function ActionButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-white/5 text-xs text-gray-400 hover:text-gray-200 transition-colors">
      {icon}
      <span>{label}</span>
    </button>
  );
}
