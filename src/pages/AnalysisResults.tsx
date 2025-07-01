
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SavedAnalysisResult } from '@/services/analysisService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AnalysisResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [result, setResult] = useState<SavedAnalysisResult | null>(null);

  useEffect(() => {
    const analysisResult = location.state?.result as SavedAnalysisResult;
    
    if (!analysisResult || !user) {
      navigate('/');
      return;
    }
    
    setResult(analysisResult);
  }, [location.state, user, navigate]);

  const handleExportPDF = () => {
    if (!result) return;
    
    // Create a simple text report for now
    const reportContent = `
تقرير تحليل العينة المنوية
============================

معلومات الملف:
- اسم الملف: ${result.file_name}
- تاريخ التحليل: ${new Date(result.created_at).toLocaleDateString('ar')}
- مدة التحليل: ${result.analysis_duration} ثانية

النتائج:
- عدد الحيوانات المنوية: ${result.sperm_count.toLocaleString()}
- نسبة الحركة: ${result.motility_percentage}%
- نسبة الشكل الطبيعي: ${result.morphology_percentage}%
- التركيز: ${result.concentration} مليون/مل
- دقة التحليل: ${result.confidence_score}%
- جودة الصورة: ${result.image_quality}

تم إنشاء هذا التقرير بواسطة SpermVision AI
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sperm_analysis_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "تم تصدير التقرير",
      description: "تم حفظ التقرير على جهازك"
    });
  };

  const handleShare = async () => {
    if (!result) return;

    const shareText = `نتائج تحليل العينة المنوية:
- عدد الخلايا: ${result.sperm_count.toLocaleString()}
- الحركة: ${result.motility_percentage}%
- دقة التحليل: ${result.confidence_score}%

تم التحليل بواسطة SpermVision AI`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'نتائج تحليل العينة المنوية',
          text: shareText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast({
        title: "تم النسخ",
        description: "تم نسخ النتائج إلى الحافظة"
      });
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

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">لم يتم العثور على نتائج التحليل</p>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">نتائج التحليل</h1>
            <p className="text-gray-400">تحليل مفصل للعينة المنوية</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Results */}
        <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
          <CardHeader>
            <CardTitle className="text-white text-center">النتائج الرئيسية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00B4D8] mb-2">
                  {result.sperm_count.toLocaleString()}
                </div>
                <div className="text-gray-400">عدد الحيوانات المنوية</div>
                <div className="text-xs text-gray-500 mt-1">خلية/مل</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {result.motility_percentage.toFixed(1)}%
                </div>
                <div className="text-gray-400">نسبة الحركة</div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.motility_percentage > 40 ? 'طبيعي' : 'منخفض'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {result.morphology_percentage.toFixed(1)}%
                </div>
                <div className="text-gray-400">الشكل الطبيعي</div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.morphology_percentage > 30 ? 'طبيعي' : 'منخفض'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {result.concentration.toFixed(1)}
                </div>
                <div className="text-gray-400">التركيز</div>
                <div className="text-xs text-gray-500 mt-1">مليون/مل</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
            <CardHeader>
              <CardTitle className="text-white">تفاصيل التحليل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">دقة التحليل</span>
                <span className="text-white font-bold">{result.confidence_score.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">جودة الصورة</span>
                <Badge className={getQualityColor(result.image_quality)}>
                  {getQualityText(result.image_quality)}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">مدة التحليل</span>
                <span className="text-white">{result.analysis_duration.toFixed(1)} ثانية</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">تاريخ التحليل</span>
                <span className="text-white">
                  {new Date(result.created_at).toLocaleDateString('ar')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
            <CardHeader>
              <CardTitle className="text-white">معلومات الملف</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">اسم الملف</span>
                <span className="text-white text-sm truncate max-w-32">
                  {result.file_name}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">نوع الملف</span>
                <span className="text-white">{result.file_type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">حجم الملف</span>
                <span className="text-white">
                  {(result.file_size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              
              {result.detected_objects && result.detected_objects.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">كائنات مكتشفة</span>
                  <span className="text-white">{result.detected_objects.length}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleExportPDF}
            className="bg-[#00B4D8] hover:bg-[#00B4D8]/80"
          >
            <FileText className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
          
          <Button
            onClick={() => navigate('/graphs')}
            variant="outline"
            className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
          >
            عرض الرسوم البيانية
          </Button>
          
          <Button
            onClick={() => navigate('/analytics')}
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            عرض جميع النتائج
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
