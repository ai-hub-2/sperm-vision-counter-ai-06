
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
  sperm_count: number;
  confidence?: number;
  analysis_time?: number;
  image_quality?: 'excellent' | 'good' | 'fair' | 'poor';
}

interface LocationState {
  file: File;
  result?: AnalysisResult;
}

const AnalysisResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, result: initialResult } = (location.state as LocationState) || {};
  
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(!initialResult);
  const [result, setResult] = useState<AnalysisResult | null>(initialResult || null);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [detectionBoxes, setDetectionBoxes] = useState<Array<{x: number, y: number, width: number, height: number}>>([]);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!file) {
      navigate('/');
      return;
    }

    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    
    return () => URL.revokeObjectURL(url);
  }, [file, navigate]);

  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          setIsAnalyzing(false);
          // Simulate final results
          setResult({
            sperm_count: Math.floor(Math.random() * 200) + 10,
            confidence: 85 + Math.random() * 10,
            analysis_time: 4.2,
            image_quality: 'excellent'
          });
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });

      setTimeRemaining(prev => Math.max(0, prev - 0.1));
      
      // Simulate AI detection boxes
      if (Math.random() < 0.3) {
        setDetectionBoxes(prev => [
          ...prev.slice(-5), // Keep last 5 boxes
          {
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20,
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4
          }
        ]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <p className="text-center text-muted-foreground">لا توجد بيانات للتحليل</p>
            <Button onClick={() => navigate('/')} className="mt-4 w-full">
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isVideo = file.type.startsWith('video/');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
            <div>
              <h1 className="text-xl font-bold">نتائج التحليل</h1>
              <p className="text-sm text-muted-foreground">تحليل العينة بالذكاء الاصطناعي</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Preview with AI Visualization */}
          <div className="space-y-6">
            <Card className={isAnalyzing ? 'animate-pulse-glow' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>عرض العينة</span>
                  {isVideo && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={togglePlay}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={restart}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden">
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
                      alt="Sample"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  )}
                  
                  {/* AI Detection Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0">
                      {detectionBoxes.map((box, index) => (
                        <div
                          key={index}
                          className="absolute border-2 border-primary animate-pulse"
                          style={{
                            left: `${box.x}%`,
                            top: `${box.y}%`,
                            width: `${box.width}%`,
                            height: `${box.height}%`,
                          }}
                        />
                      ))}
                      <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        <Zap className="w-4 h-4 inline mr-1" />
                        AI يقوم بالتحليل...
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">التقدم في التحليل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>معالجة الإطارات</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="bg-muted progress-bar" />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>الوقت المتبقي: {timeRemaining.toFixed(1)}s</span>
                    <span>{Math.round(analysisProgress * 0.3)} إطار تم معالجته</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {result ? (
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Eye className="w-5 h-5" />
                    النتائج النهائية
                  </CardTitle>
                  <CardDescription>تم الانتهاء من التحليل بنجاح</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Result */}
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {result.sperm_count.toLocaleString()}
                    </div>
                    <div className="text-lg text-muted-foreground mb-3">
                      خلية منوية تم اكتشافها
                    </div>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      دقة التحليل: {Math.round(result.confidence || 0)}%
                    </Badge>
                  </div>

                  {/* Detailed Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {(result.analysis_time || 0).toFixed(1)}s
                      </div>
                      <div className="text-sm text-muted-foreground">وقت التحليل</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary capitalize">
                        {result.image_quality || 'جيد'}
                      </div>
                      <div className="text-sm text-muted-foreground">جودة العينة</div>
                    </div>
                  </div>

                  {/* Clinical Reference */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
                      المرجع الطبي
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      التركيز الطبيعي للحيوانات المنوية: 15+ مليون/مل. هذا التحليل لأغراض البحث فقط 
                      ولا يجب أن يحل محل التقييم الطبي المتخصص.
                    </p>
                  </div>

                  <Button 
                    onClick={() => navigate('/')} 
                    className="w-full"
                    size="lg"
                  >
                    تحليل عينة جديدة
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">انتظار النتائج</CardTitle>
                  <CardDescription>
                    يتم معالجة العينة بواسطة الذكاء الاصطناعي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">معالجة البيانات...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
