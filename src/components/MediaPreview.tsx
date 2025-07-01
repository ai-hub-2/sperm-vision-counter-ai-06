import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Eye, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MediaPreviewProps {
  file: File | null;
  isAnalyzing: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ file, isAnalyzing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [mediaUrl, setMediaUrl] = React.useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMediaUrl(null);
    }
  }, [file]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!file || !mediaUrl) {
    return (
      <Card className="border-dashed border-2 border-primary/20 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-muted-foreground flex items-center gap-2">
            <Eye className="w-5 h-5" />
            معاينة الوسائط
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Eye className="w-10 h-10 text-primary/50" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">
              لم يتم اختيار أي وسائط للمعاينة
            </p>
            <p className="text-sm text-muted-foreground">
              اختر ملف أو استخدم الكاميرا لبدء التحليل
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isVideo = file.type.startsWith('video/');

  return (
    <Card className={cn(
      "transition-all duration-300 bg-card/60 backdrop-blur-sm",
      isAnalyzing ? 'animate-pulse-glow border-primary/60 shadow-lg' : 'border-primary/20'
    )}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            معاينة الوسائط
          </span>
          {isVideo && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                disabled={isAnalyzing}
                className="hover:bg-primary/10 hover:text-primary"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={restart}
                disabled={isAnalyzing}
                className="hover:bg-primary/10 hover:text-primary"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black/90 rounded-xl overflow-hidden group shadow-2xl">
          {isVideo ? (
            <video
              ref={videoRef}
              src={mediaUrl}
              className="w-full h-auto max-h-96 object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              controls={false}
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain"
            />
          )}
          
          {/* Enhanced Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-md">
              <div className="bg-card/95 rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-primary/20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="text-center">
                  <p className="font-semibold text-lg">جاري تحليل الإطارات</p>
                  <p className="text-sm text-muted-foreground mt-1">يرجى الانتظار...</p>
                </div>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          {!isAnalyzing && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          )}
        </div>
        
        {/* Enhanced File Info */}
        <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex justify-between items-center text-sm">
            <div className="space-y-2">
              <p className="font-semibold truncate text-foreground">{file.name}</p>
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                  {isVideo ? 'فيديو' : 'صورة'}
                </span>
                <span className="text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary">
                <Volume2 className="w-4 h-4" />
                <p className="font-medium">جاهز للتحليل</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
