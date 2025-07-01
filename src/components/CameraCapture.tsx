
import React, { useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CameraModeSelector } from '@/components/camera/CameraModeSelector';
import { CameraControls } from '@/components/camera/CameraControls';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [cameraActive, setCameraActive] = useState(false);
  
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment' // استخدام الكاميرا الخلفية
        },
        audio: mode === 'video'
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      mediaStreamRef.current = stream;
      setCameraActive(true);
      
      toast({
        title: "تم تشغيل الكاميرا",
        description: "جاهز للتقاط الصور أو الفيديو"
      });
    } catch (error) {
      toast({
        title: "خطأ في الكاميرا",
        description: "لا يمكن الوصول للكاميرا. تأكد من السماح بالوصول.",
        variant: "destructive"
      });
    }
  }, [mode, toast]);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        stopCamera();
        onClose();
        toast({
          title: "تم التقاط الصورة",
          description: "سيتم تحليل الصورة الآن"
        });
      }
    }, 'image/jpeg', 0.95);
  }, [onCapture, onClose, stopCamera, toast]);

  const startRecording = useCallback(() => {
    if (!mediaStreamRef.current) return;
    
    const mediaRecorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks: Blob[] = [];
    setRecordedChunks(chunks);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
      onCapture(file);
      stopCamera();
      onClose();
      toast({
        title: "تم تسجيل الفيديو",
        description: "سيتم تحليل الفيديو الآن"
      });
    };
    
    mediaRecorder.start();
    setIsRecording(true);
  }, [onCapture, onClose, stopCamera, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>التقاط من الكاميرا</span>
            <CameraModeSelector mode={mode} onModeChange={setMode} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                ● جاري التسجيل
              </div>
            )}
          </div>
          
          <CameraControls
            mode={mode}
            isRecording={isRecording}
            cameraActive={cameraActive}
            onModeChange={setMode}
            onStartCamera={startCamera}
            onCapturePhoto={capturePhoto}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onClose={onClose}
          />
        </CardContent>
      </Card>
    </div>
  );
};
