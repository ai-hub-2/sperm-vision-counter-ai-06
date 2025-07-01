
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { analysisService, SavedAnalysisResult } from '@/services/analysisService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Download, TrendingUp, Calendar, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [results, setResults] = useState<SavedAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysisHistory();
  }, [user]);

  const loadAnalysisHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const history = await analysisService.getUserAnalysisHistory(user.id);
      setResults(history);
    } catch (error) {
      console.error('Error loading analysis history:', error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل سجل التحليلات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resultId: string) => {
    try {
      await analysisService.deleteAnalysisResult(resultId);
      setResults(prev => prev.filter(result => result.id !== resultId));
      toast({
        title: "تم الحذف",
        description: "تم حذف نتيجة التحليل بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ في الحذف",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleViewResult = (result: SavedAnalysisResult) => {
    navigate('/analysis-results', { state: { result } });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analysis_results_${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير جميع النتائج بنجاح"
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">جاري تحميل النتائج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">تحليلات النتائج</h1>
          <p className="text-gray-400">
            عرض وإدارة جميع نتائج التحليل السابقة
          </p>
        </div>

        {results.length === 0 ? (
          <Card className="bg-[#1B2A3A] border-[#00B4D8]/20">
            <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
              <TrendingUp className="w-16 h-16 text-gray-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-white">لا توجد نتائج بعد</h3>
                <p className="text-gray-400">
                  ابدأ بتحليل بعض العينات لرؤية النتائج هنا
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="mt-4 bg-[#00B4D8] hover:bg-[#00B4D8]/80"
                >
                  ابدأ التحليل الأول
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00B4D8]" />
                <span className="font-medium text-white">{results.length} نتيجة تحليل</span>
              </div>
              <Button 
                onClick={handleExport} 
                variant="outline"
                className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير النتائج
              </Button>
            </div>

            <div className="grid gap-4">
              {results.map((result) => (
                <Card key={result.id} className="bg-[#1B2A3A] border-[#00B4D8]/20 hover:shadow-lg hover:shadow-[#00B4D8]/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate text-white">{result.file_name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResult(result)}
                          className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(result.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#00B4D8]">
                          {result.sperm_count.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          خلايا منوية
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">
                          {result.motility_percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">
                          الحركة
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">
                          {Math.round(result.confidence_score)}%
                        </div>
                        <div className="text-sm text-gray-400">
                          دقة التحليل
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Badge className={getQualityColor(result.image_quality)}>
                          {getQualityText(result.image_quality)}
                        </Badge>
                        <div className="text-sm text-gray-400 mt-1">
                          جودة الصورة
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-medium text-white">
                          {result.analysis_duration.toFixed(1)}s
                        </div>
                        <div className="text-sm text-gray-400">
                          وقت التحليل
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(result.created_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                      </div>
                      <div>
                        {(result.file_size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
