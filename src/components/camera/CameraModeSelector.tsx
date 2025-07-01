
import React from 'react';
import { Camera, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraModeSelectorProps {
  mode: 'photo' | 'video';
  onModeChange: (mode: 'photo' | 'video') => void;
}

export const CameraModeSelector: React.FC<CameraModeSelectorProps> = ({
  mode,
  onModeChange
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={mode === 'photo' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onModeChange('photo')}
      >
        <Camera className="w-4 h-4 mr-1" />
        صورة
      </Button>
      <Button
        variant={mode === 'video' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onModeChange('video')}
      >
        <Video className="w-4 h-4 mr-1" />
        فيديو
      </Button>
    </div>
  );
};
