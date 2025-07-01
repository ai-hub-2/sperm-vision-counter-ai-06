
import React from 'react';
import { Camera, Video, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraControlsProps {
  mode: 'photo' | 'video';
  isRecording: boolean;
  cameraActive: boolean;
  onModeChange: (mode: 'photo' | 'video') => void;
  onStartCamera: () => void;
  onCapturePhoto: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onClose: () => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  mode,
  isRecording,
  cameraActive,
  onModeChange,
  onStartCamera,
  onCapturePhoto,
  onStartRecording,
  onStopRecording,
  onClose
}) => {
  if (!cameraActive) {
    return (
      <div className="flex justify-center">
        <Button onClick={onStartCamera} size="lg">
          <Camera className="w-6 h-6 mr-2" />
          تشغيل الكاميرا
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      {mode === 'photo' ? (
        <Button onClick={onCapturePhoto} size="lg" className="px-8">
          <Camera className="w-5 h-5 mr-2" />
          التقاط صورة
        </Button>
      ) : (
        <>
          {!isRecording ? (
            <Button onClick={onStartRecording} size="lg" className="px-8">
              <Video className="w-5 h-5 mr-2" />
              بدء التسجيل
            </Button>
          ) : (
            <Button onClick={onStopRecording} size="lg" variant="destructive" className="px-8">
              <Square className="w-5 h-5 mr-2" />
              إيقاف التسجيل
            </Button>
          )}
        </>
      )}
      
      <Button onClick={onClose} variant="outline" size="lg">
        إلغاء
      </Button>
    </div>
  );
};
