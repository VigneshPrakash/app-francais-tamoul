
import React, { useState } from 'react';
import { Message } from '../types';
import { Sparkles, User, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const sections = {
      main: [] as React.ReactNode[],
      details: [] as React.ReactNode[],
      hasDetails: false
    };

    lines.forEach((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      if (trimmedLine.includes('- Tamil :')) {
        const value = trimmedLine.split('- Tamil :')[1]?.trim().replace(/\*\*/g, '').replace(/"/g, '');
        sections.main.push(
          <div key={i} className="relative my-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center">
             {/* The rounded orange bar from the screenshot */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-14 bg-orange-500 rounded-r-full"></div>
            <span className="text-[#E8601C] font-extrabold text-2xl tracking-tight leading-tight px-2">
              **"{value}"**
            </span>
          </div>
        );
      } else if (trimmedLine.includes('- French Meaning :')) {
        const value = trimmedLine.split('- French Meaning :')[1]?.trim().replace(/\*\*/g, '').replace(/"/g, '');
        sections.main.push(
          <p key={i} className="text-gray-800 text-[16px] mb-3 flex items-start gap-2 leading-relaxed">
            <span className="flex-shrink-0 mt-0.5">🇫🇷</span>
            <span className="font-semibold text-[#E91E63] whitespace-nowrap">Sens :</span>
            <span className="font-bold text-[#2C3E50]">**"{value}"**</span>
          </p>
        );
      } else if (trimmedLine.includes('- Pronunciation :')) {
        const value = trimmedLine.split('- Pronunciation :')[1]?.trim().replace(/\*\*/g, '').replace(/"/g, '');
        sections.main.push(
          <div key={i} className="flex items-start gap-2 mb-2">
            <span className="text-[#3A7BD5] mt-1 flex-shrink-0 text-lg">🗣️</span>
            <p className="text-[15px] text-[#4F5B66] leading-relaxed italic">
              <span className="font-bold text-[#3A7BD5] not-italic">Prononciation :</span> 
              <span className="ml-1 font-bold text-[#2C3E50]">**"{value}"**</span>
            </p>
          </div>
        );
      } else if (trimmedLine.includes('- Fun Fact :') || trimmedLine.includes('- Intro :')) {
        sections.hasDetails = true;
        const value = trimmedLine.split(':')[1]?.trim();
        const label = trimmedLine.includes('- Fun Fact :') ? '💡 Fun Fact' : '💬 Note';
        sections.details.push(
          <div key={i} className="mt-2 p-3 bg-pink-50/50 border border-pink-100 rounded-xl text-[13px] text-pink-900 leading-relaxed shadow-sm">
            <span className="font-bold block mb-0.5 text-pink-700">{label} :</span>
            {value}
          </div>
        );
      } else {
        if (!isUser) {
          sections.hasDetails = true;
          sections.details.push(<p key={i} className="text-[13px] text-gray-500 mb-2">{trimmedLine}</p>);
        } else {
          sections.main.push(<p key={i} className="mb-2 leading-relaxed font-medium">{trimmedLine}</p>);
        }
      }
    });

    return sections;
  };

  const content = parseContent(message.text);

  return (
    <div className={`flex items-start gap-3 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
        isUser ? 'bg-indigo-500' : 'bg-gradient-to-tr from-pink-400 to-orange-400'
      }`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
      </div>
      
      <div className={`group relative max-w-[88%] rounded-3xl px-5 py-4 text-sm shadow-sm transition-all border border-gray-50 ${
        isUser 
          ? 'bg-indigo-600 text-white rounded-tr-none' 
          : 'bg-white text-gray-800 rounded-tl-none ring-1 ring-gray-100/50'
      }`}>
        <div className="whitespace-pre-wrap">
          {content.main}
          
          {!isUser && content.hasDetails && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-xs font-black text-pink-500 hover:text-pink-600 transition-all uppercase tracking-widest"
              >
                {isExpanded ? (
                  <>Moins d'infos <ChevronUp className="w-3 h-3 stroke-[3px]" /></>
                ) : (
                  <>En savoir plus <ChevronDown className="w-3 h-3 stroke-[3px]" /></>
                )}
              </button>
              
              {isExpanded && (
                <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {content.details}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={`absolute -bottom-1 ${isUser ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          <button 
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-white rounded-full text-gray-400 shadow-sm border border-gray-100"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <span className={`text-[9px] block mt-2 font-bold tracking-tighter uppercase ${isUser ? 'text-indigo-200 text-right' : 'text-gray-300'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
