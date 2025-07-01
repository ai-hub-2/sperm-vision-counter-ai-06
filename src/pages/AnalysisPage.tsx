
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analysisService } from '@/services/analysisService';

const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedObjects, setDetectedObjects] = useState<Array<{x: number, y: number, confidence: number}>>([]);
  const [analysisTime, setAnalysisTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fileFromState = location.state?.file;
    if (fileFromState) {
      setFile(fileFromState);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisTime(prev => prev + 0.1);
        setProgress(prev => {
          const newProgress = Math.min(prev + 2, 95);
          
          // Simulate object detection
          if (newProgress > 20) {
            const newObjects = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
              x: Math.random() * 400,
              y: Math.random() * 300,
              confidence: 0.7 + Math.random() * 0.3
            }));
            setDetectedObjects(newObjects);
          }
          
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const startAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisTime(0);
    setDetectedObjects([]);

    try {
      // Simulate real-time analysis
      setTimeout(async () => {
        setProgress(100);
        
        // Perform actual analysis
        const result = await analysisService.analyzeFile(file);
        
        // Navigate to results with the analysis data
        navigate('/analysis-results', {
          state: { 
            file, 
            result,
            detectedObjects,
            analysisTime: analysisTime.toFixed(1)
          }
        });

        toast({
          title: "تم إكمال التحليل",
          description: "تم تحليل العينة بنجاح"
        });
      }, 8000);

    } catch (error: any) {
      toast({
        title: "فشل التحليل",
        description: error.message,
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setIsAnalyzing(false);
    setProgress(0);
    setAnalysisTime(0);
    setDetectedObjects([]);
  };

  if (!file) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">لا يوجد ملف للتحليل</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">تحليل العينة</h1>
          <p className="text-gray-400">تحليل الحيوانات المنوية باستخدام الذكاء الاصطناعي</p>
        </div>

        {/* Media Preview with Overlay */}
        <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-6">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {file.type.startsWith('video/') ? (
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                className="w-full h-64 object-contain"
                controls={!isAnalyzing}
                muted
                loop
              />
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt="Analysis Sample"
                className="w-full h-64 object-contain"
              />
            )}
            
            {/* AI Detection Overlay */}
            {isAnalyzing && detectedObjects.length > 0 && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                width={400}
                height={300}
              />
            )}
            
            {/* Detection Boxes */}
            {isAnalyzing && detectedObjects.map((obj, index) => (
              <div
                key={index}
                className="absolute border-2 border-[#00B4D8] rounded animate-pulse"
                style={{
                  left: `${obj.x}px`,
                  top: `${obj.y}px`,
                  width: '20px',
                  height: '20px'
                }}
              >
                <div className="bg-[#00B4D8] text-white text-xs px-1 rounded -mt-6">
                  {(obj.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Analysis Controls */}
        <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">حالة التحليل</h3>
                <p className="text-gray-400">
                  {isAnalyzing ? 'جاري التحليل...' : 'جاهز للبدء'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#00B4D8]">
                  {analysisTime.toFixed(1)}s
                </div>
                <div className="text-sm text-gray-400">وقت التحليل</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">التقدم</span>
                <span className="text-[#00B4D8]">{progress.toFixed(0)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-3 bg-gray-700"
              />
            </div>

            {/* Detected Objects Counter */}
            {detectedObjects.length > 0 && (
              <div className="bg-[#00B4D8]/10 rounded-lg p-4 border border-[#00B4D8]/20">
                <div className="flex items-center justify-between">
                  <span className="text-white">الكائنات المكتشفة</span>
                  <span className="text-2xl font-bold text-[#00B4D8]">
                    {detectedObjects.length}
                  </span>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4">
              {!isAnalyzing ? (
                <Button
                  onClick={startAnalysis}
                  className="flex-1 bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-white"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  بدء التحليل
                </Button>
              ) : (
                <Button
                  onClick={resetAnalysis}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                  size="lg"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  إيقاف التحليل
                </Button>
              )}
              
              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
                disabled={isAnalyzing}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Real-time Stats */}
        {isAnalyzing && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B4D8] mb-1">
                  {detectedObjects.length}
                </div>
                <div className="text-sm text-gray-400">كائنات مكتشفة</div>
              </div>
            </Card>
            
            <Card className="bg-[#1A2332] border-[#00B4D8]/20 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {detectedObjects.length > 0 ? (detectedObjects.reduce((sum, obj) => sum + obj.confidence, 0) / detectedObjects.length * 100).toFixed(0) : 0}%
                </div>
                <div className="text-sm text-gray-400">دقة الكشف</div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
