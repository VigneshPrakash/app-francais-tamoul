
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from './services/geminiService';
import { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { 
  Send, 
  Sparkles, 
  Heart, 
  Coffee, 
  Utensils, 
  Flame, 
  Info,
  Mic,
  MicOff
} from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const geminiRef = useRef<GeminiService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!geminiRef.current) {
      geminiRef.current = new GeminiService();
    }

    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessagePlaceholder: Message = {
      role: 'model',
      text: '',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, modelMessagePlaceholder]);

    let accumulatedResponse = '';
    await geminiRef.current?.sendMessageStream(text, (chunk) => {
      accumulatedResponse += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'model') {
          return [...prev.slice(0, -1), { ...last, text: accumulatedResponse }];
        }
        return prev;
      });
    });

    setIsLoading(false);
  };

  const quickPrompts = [
    { label: "Comment dire 'Je t'aime' ?", icon: <Heart className="w-4 h-4 text-pink-500" />, text: "Comment dire 'Je t'aime' ?" },
    { label: "Il a faim ?", icon: <Utensils className="w-4 h-4 text-orange-500" />, text: "Comment demander s'il a faim ?" },
    { label: "Je boude !", icon: <Flame className="w-4 h-4 text-red-500" />, text: "Comment dire 'Laisse moi tranquille' ?" },
    { label: "Un café ?", icon: <Coffee className="w-4 h-4 text-brown-500" />, text: "Comment proposer un café ?" },
  ];

  if (!isStarted) {
    return <WelcomeScreen onStart={() => setIsStarted(true)} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto border-x border-gray-100 bg-white shadow-xl overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800 tracking-tight">Mathilde <span className="text-pink-500 text-sm font-normal">parle Tamoul</span></h1>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Ta coach de Tamil perso
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-2">
              <Heart className="w-10 h-10 text-pink-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Salut Mathilde !</h2>
            <p className="max-w-xs text-gray-500 text-sm leading-relaxed">
              Dis-moi ce que tu veux dire à ton chéri en français, ou utilise le micro pour parler !
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-6">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.text)}
                  className="flex items-center gap-2 p-3 text-left text-sm bg-gray-50 hover:bg-pink-50 border border-gray-100 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {p.icon}
                  <span className="font-medium text-gray-700">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-pink-500" />
             </div>
             <div className="bg-gray-100 rounded-2xl px-4 py-2 text-gray-400 text-sm italic">
               En train de réfléchir... 🇮🇳
             </div>
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      {messages.length > 0 && (
         <div className="px-4 py-2 border-t bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            {quickPrompts.map((p, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(p.text)}
                className="text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-full flex items-center gap-1.5 hover:bg-pink-50 transition-colors"
              >
                {p.icon} {p.label}
              </button>
            ))}
         </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t sticky bottom-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Je t'écoute..." : "Écris-moi en français..."}
            className={`flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all ${
              isListening ? 'placeholder-red-400 italic' : ''
            }`}
          />
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white shadow-lg transition-all disabled:opacity-50 disabled:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          Focus sur le Tamil parlé (Tanglish) • Micro activé pour Mathilde
        </p>
      </div>
    </div>
  );
};

export default App;