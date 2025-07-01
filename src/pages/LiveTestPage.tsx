
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Square, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const LiveTestPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment' // Use back camera on mobile
        },
        audio: false
      });
      
      setMediaStream(stream);
      setIsCameraOn(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      toast({
        title: "تم تشغيل الكاميرا",
        description: "يمكنك الآن التقاط صورة أو تسجيل فيديو"
      });
    } catch (error) {
      toast({
        title: "فشل في تشغيل الكاميرا",
        description: "تأكد من السماح بالوصول للكاميرا",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setIsCameraOn(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'live-capture.jpg', { type: 'image/jpeg' });
          navigate('/analysis', { state: { file } });
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const startRecording = () => {
    if (!mediaStream) return;

    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=vp8'
    });
    
    const chunks: BlobPart[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setRecordedBlob(blob);
      const file = new File([blob], 'live-recording.webm', { type: 'video/webm' });
      navigate('/analysis', { state: { file } });
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    toast({
      title: "بدء التسجيل",
      description: "جاري تسجيل الفيديو..."
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "تم إيقاف التسجيل",
        description: "سيتم تحليل الفيديو المسجل"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">الاختبار المباشر</h1>
          <p className="text-gray-400">التقط صورة أو سجل فيديو للتحليل الفوري</p>
        </div>

        {/* Camera Preview */}
        <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-6">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {isCameraOn ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 md:h-96 object-cover"
                />
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <span className="font-mono">{formatTime(recordingTime)}</span>
                  </div>
                )}

                {/* Camera Grid Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/20" />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-64 md:h-96 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">اضغط لتشغيل الكاميرا</p>
                  <Button
                    onClick={startCamera}
                    className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-white"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    تشغيل الكاميرا
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Controls */}
        {isCameraOn && (
          <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-6">
            <div className="flex justify-center gap-4">
              <Button
                onClick={capturePhoto}
                disabled={isRecording}
                className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-white"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                التقاط صورة
              </Button>
              
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Video className="w-5 h-5 mr-2" />
                  بدء التسجيل
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  إيقاف التسجيل
                </Button>
              )}
              
              <Button
                onClick={stopCamera}
                variant="outline"
                className="border-gray-400 text-gray-400 hover:bg-gray-400/10"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                إيقاف الكاميرا
              </Button>
            </div>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">نصائح للحصول على أفضل النتائج</h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0" />
              <p>تأكد من الإضاءة الجيدة والواضحة</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0" />
              <p>حافظ على ثبات الكاميرا أثناء التسجيل</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0" />
              <p>اجعل العينة في مركز الإطار</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0" />
              <p>استخدم التسجيل للعينات المتحركة والصورة للعينات الثابتة</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LiveTestPage;
