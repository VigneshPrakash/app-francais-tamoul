
import React from 'react';
import { Heart, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-12 bg-white">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-pink-100 flex items-center justify-center animate-pulse">
          <Heart className="w-16 h-16 text-pink-500 fill-current" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center rotate-12">
            <Sparkles className="w-6 h-6 text-orange-500" />
        </div>
      </div>

      <div className="space-y-4 max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Mathilde parle Tamoul</h1>
        <p className="text-xl text-pink-500 font-medium italic">Ton secret pour charmer ton Tamil Boy.</p>
        <p className="text-gray-500 leading-relaxed">
          Oublie les manuels barbants. Apprends le vrai Tamil — celui qui se parle, celui qui fait rire, celui qui dit "Je t'aime".
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 py-4 bg-pink-500 text-white rounded-full font-bold text-lg shadow-xl shadow-pink-200 hover:bg-pink-600 transition-all hover:scale-105 active:scale-95"
        >
          Allons-y Mathilde ! <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="flex items-center justify-center gap-8 pt-4 grayscale opacity-40">
           <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                 <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">CHAT</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                 <span className="text-sm font-bold">🇮🇳</span>
              </div>
              <span className="text-[10px] font-bold">TAMIL</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                 <span className="text-sm font-bold">🍷</span>
              </div>
              <span className="text-[10px] font-bold">FRENCH</span>
           </div>
        </div>
      </div>

      <footer className="text-[10px] text-gray-400 absolute bottom-8">
        MADE WITH ❤️ FOR CROSS-CULTURAL LOVE
      </footer>
    </div>
  );
};
