
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';

interface AnalysisButtonProps {
  isAnalyzing: boolean;
  onClick: () => void;
}

export const AnalysisButton: React.FC<AnalysisButtonProps> = ({ 
  isAnalyzing, 
  onClick 
}) => {
  return (
    <Button
      variant="medical"
      size="lg"
      onClick={onClick}
      disabled={isAnalyzing}
      className="px-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {isAnalyzing ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          جاري التحليل...
        </>
      ) : (
        <>
          <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
          بدء التحليل
        </>
      )}
    </Button>
  );
};
