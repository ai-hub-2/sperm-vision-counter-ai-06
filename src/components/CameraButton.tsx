
import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraButtonProps {
  onClick: () => void;
}

export const CameraButton: React.FC<CameraButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onClick}
      className="px-8 gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300 shadow-lg"
    >
      <Camera className="w-5 h-5" />
      استخدام الكاميرا
    </Button>
  );
};
