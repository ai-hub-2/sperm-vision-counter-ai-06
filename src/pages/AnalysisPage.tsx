import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { analysisService, SavedAnalysisResult } from '@/services/analysisService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Download, Eye, Loader2, Activity, FlaskConical } from 'lucide-react';

const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<SavedAnalysisResult | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const file = location.state?.file as File;

  useEffect(() => {
    if (!file || !user) {
      navigate('/');
      return;
    }

    startAnalysis();
  }, [file, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 0.1);
        setProgress(prev => Math.min(95, prev + Math.random() * 3));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const startAnalysis = async () => {
    if (!file || !user) return;

    setIsAnalyzing(true);
    setProgress(10);
    setTimeElapsed(0);

    try {
      console.log('بدء التحليل للملف:', file.name);
      const result = await analysisService.analyzeFile(file, user.id);
      
      setProgress(100);
      setAnalysisResult(result);
      
      toast({
        title: "تم التحليل بنجاح",
        description: `تم اكتشاف ${result.sperm_count} خلية منوية`
      });

    } catch (error: any) {
      console.error('فشل في التحليل:', error);
      toast({
        title: "فشل في التحليل",
        description: error.message || "حدث خطأ أثناء التحليل",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewResults = () => {
    if (analysisResult) {
      navigate('/analysis-results', { state: { result: analysisResult } });
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'ممتازة';
      case 'good': return 'جيدة';
      case 'fair': return 'متوسطة';
      case 'poor': return 'ضعيفة';
      default: return 'غير محدد';
    }
  };

  const getWHOClassificationText = (classification: string) => {
    switch (classification) {
      case 'normozoospermia': return 'طبيعي';
      case 'oligozoospermia': return 'قلة عدد';
      case 'asthenozoospermia': return 'ضعف حركة';
      case 'teratozoospermia': return 'تشوه شكلي';
      case 'oligoasthenoteratozoospermia': return 'مشترك';
      case 'azoospermia': return 'انعدام';
      default: return classification;
    }
  };

  if (!file) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">لم يتم العثور على ملف للتحليل</p>
          <Button onClick={() => navigate('/')} className="bg-[#00B4D8] hover:bg-[#00B4D8]/80">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">تحليل العينة</h1>
          <p className="text-gray-400">جاري تحليل الملف باستخدام الذكاء الاصطناعي</p>
        </div>

        {/* File Preview */}
        <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              معاينة الملف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                {file.type.startsWith('image/') ? (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="معاينة الملف"
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                ) : file.type.startsWith('video/') ? (
                  <video 
                    src={URL.createObjectURL(file)} 
                    controls
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full max-w-md mx-auto h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">معاينة غير متاحة</p>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 text-right">
                <p className="text-white"><strong>اسم الملف:</strong> {file.name}</p>
                <p className="text-white"><strong>الحجم:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p className="text-white"><strong>النوع:</strong> {file.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {isAnalyzing ? 'جاري التحليل...' : 'اكتمل التحليل'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">التقدم</span>
                <span className="text-[#00B4D8]">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {isAnalyzing && (
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  الوقت المنقضي: {timeElapsed.toFixed(1)} ثانية
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  جاري معالجة الصورة باستخدام نموذج YOLOv8...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Main Results Card */}
            <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5" />
                  نتائج التحليل المفصلة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#00B4D8] mb-1">
                      {analysisResult.sperm_count.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">عدد الخلايا المنوية</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {analysisResult.concentration}M/ml
                    </div>
                    <div className="text-sm text-gray-400">التركيز</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {analysisResult.volume_ml}ml
                    </div>
                    <div className="text-sm text-gray-400">الحجم</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {analysisResult.ph_level}
                    </div>
                    <div className="text-sm text-gray-400">درجة الحموضة</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motility Analysis Card */}
            <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  تحليل الحركة المفصل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-2">
                      {analysisResult.progressive_motility_percentage}%
                    </div>
                    <div className="text-sm text-gray-400 mb-2">الحركة التقدمية</div>
                    <Progress value={analysisResult.progressive_motility_percentage} className="h-2" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500 mb-2">
                      {analysisResult.non_progressive_motility_percentage}%
                    </div>
                    <div className="text-sm text-gray-400 mb-2">الحركة غير التقدمية</div>
                    <Progress value={analysisResult.non_progressive_motility_percentage} className="h-2" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500 mb-2">
                      {analysisResult.immotile_percentage}%
                    </div>
                    <div className="text-sm text-gray-400 mb-2">عديمة الحركة</div>
                    <Progress value={analysisResult.immotile_percentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Morphology Analysis Card */}
            <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
              <CardHeader>
                <CardTitle className="text-white">تحليل التشكل المورفولوجي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-500 mb-1">
                      {analysisResult.morphology_percentage}%
                    </div>
                    <div className="text-sm text-gray-400">الشكل الطبيعي</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-500 mb-1">
                      {analysisResult.head_defects_percentage}%
                    </div>
                    <div className="text-sm text-gray-400">عيوب الرأس</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500 mb-1">
                      {analysisResult.midpiece_defects_percentage}%
                    </div>
                    <div className="text-sm text-gray-400">عيوب الوسط</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-500 mb-1">
                      {analysisResult.tail_defects_percentage}%
                    </div>
                    <div className="text-sm text-gray-400">عيوب الذيل</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classification and Quality */}
            <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  <Badge className="text-lg px-4 py-2 bg-blue-500">
                    التصنيف: {getWHOClassificationText(analysisResult.who_classification)}
                  </Badge>
                  
                  <Badge className={`text-lg px-4 py-2 ${getQualityColor(analysisResult.image_quality)}`}>
                    جودة الصورة: {getQualityText(analysisResult.image_quality)}
                  </Badge>
                  
                  <Badge className="text-lg px-4 py-2 bg-green-500">
                    الحيوية: {analysisResult.vitality_percentage}%
                  </Badge>
                  
                  <Badge className="text-lg px-4 py-2 bg-purple-500">
                    دقة التحليل: {analysisResult.confidence_score}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleViewResults}
                className="bg-[#00B4D8] hover:bg-[#00B4D8]/80"
              >
                <Eye className="w-4 h-4 mr-2" />
                عرض النتائج التفصيلية
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/graphs')}
                className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
              >
                <Download className="w-4 h-4 mr-2" />
                عرض الرسوم البيانية
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
