
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { analysisService, SavedAnalysisResult } from '@/services/analysisService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Download, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [results, setResults] = useState<SavedAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysisHistory();
  }, [user]);

  const loadAnalysisHistory = async () => {
    if (!user) return;
    
    try {
      const history = await analysisService.getUserAnalysisHistory(user.id);
      setResults(history);
    } catch (error) {
      console.error('Error loading analysis history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resultId: string) => {
    if (!user) return;
    
    try {
      await analysisService.deleteAnalysisResult(resultId, user.id);
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

  const handleExport = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analysis_results_${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل النتائج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">تحليلات النتائج</h1>
          <p className="text-muted-foreground">
            عرض وإدارة جميع نتائج التحليل السابقة
          </p>
        </div>

        {results.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
              <TrendingUp className="w-16 h-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">لا توجد نتائج بعد</h3>
                <p className="text-muted-foreground">
                  ابدأ بتحليل بعض العينات لرؤية النتائج هنا
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">{results.length} نتيجة تحليل</span>
              </div>
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                تصدير النتائج
              </Button>
            </div>

            <div className="grid gap-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{result.file_name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(result.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {result.sperm_count.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          خلايا منوية
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {Math.round(result.confidence)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          دقة التحليل
                        </div>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {result.image_quality}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          جودة الصورة
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {result.analysis_time.toFixed(1)}s
                        </div>
                        <div className="text-sm text-muted-foreground">
                          وقت التحليل
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(result.created_at), 'dd/MM/yyyy HH:mm')}
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
