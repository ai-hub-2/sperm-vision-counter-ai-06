
import React from 'react';
import { Microscope, Sparkles } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <header className="border-b border-primary/20 bg-card/60 backdrop-blur-sm sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-lg animate-pulse-glow">
              <Microscope className="w-8 h-8 text-primary" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                SpermVision AI
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                تحليل متقدم للحيوانات المنوية بالذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
