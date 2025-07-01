
import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp, Eye, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnalysisResult {
  sperm_count: number;
  confidence?: number;
  analysis_time?: number;
  image_quality?: 'excellent' | 'good' | 'fair' | 'poor';
}

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  isAnalyzing
}) => {
  if (isAnalyzing) {
    return (
      <Card className="animate-pulse-glow border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            جاري تحليل العينة...
          </CardTitle>
          <CardDescription>
            الذكاء الاصطناعي يحلل العينة لاكتشاف وعد الخلايا المنوية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>معالجة الإطارات</span>
                <span>يرجى الانتظار...</span>
              </div>
              <Progress value={undefined} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-muted rounded mx-auto mb-2"></div>
                <div className="text-sm text-muted-foreground">اكتشاف الخلايا</div>
              </div>
              <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>
                <div className="w-8 h-8 bg-muted rounded mx-auto mb-2"></div>
                <div className="text-sm text-muted-foreground">تحليل الجودة</div>
              </div>
              <div className="animate-pulse" style={{ animationDelay: '1s' }}>
                <div className="w-8 h-8 bg-muted rounded mx-auto mb-2"></div>
                <div className="text-sm text-muted-foreground">حساب النتائج</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed border-2 border-primary/20 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-5 h-5" />
            نتائج التحليل
          </CardTitle>
          <CardDescription>
            ارفع فيديو أو صورة لبدء تحليل الحيوانات المنوية
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-32 space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Zap className="w-8 h-8 text-primary/50" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            في انتظار رفع الملف للبدء في التحليل
          </p>
        </CardContent>
      </Card>
    );
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'ممتازة';
      case 'good': return 'جيدة';
      case 'fair': return 'مقبولة';
      case 'poor': return 'ضعيفة';
      default: return quality;
    }
  };

  const getCountStatus = (count: number) => {
    if (count === 0) return { 
      icon: AlertCircle, 
      color: 'text-destructive', 
      status: 'لم يتم اكتشاف خلايا',
      bgColor: 'bg-destructive/10'
    };
    if (count < 15) return { 
      icon: AlertCircle, 
      color: 'text-orange-600', 
      status: 'عدد منخفض',
      bgColor: 'bg-orange-100'
    };
    if (count < 50) return { 
      icon: CheckCircle, 
      color: 'text-blue-600', 
      status: 'عدد متوسط',
      bgColor: 'bg-blue-100'
    };
    return { 
      icon: TrendingUp, 
      color: 'text-green-600', 
      status: 'عدد عالي',
      bgColor: 'bg-green-100'
    };
  };

  const countStatus = getCountStatus(result.sperm_count);
  const StatusIcon = countStatus.icon;

  return (
    <Card className="animate-slide-up border-primary/30 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          تم إكمال التحليل
        </CardTitle>
        <CardDescription>
          تم تحليل العينة بنجاح بواسطة الذكاء الاصطناعي
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Count Result */}
        <div className={`text-center p-6 rounded-xl ${countStatus.bgColor} border border-primary/20`}>
          <div className="text-4xl font-bold text-primary mb-2">
            {result.sperm_count.toLocaleString()}
          </div>
          <div className="text-lg text-muted-foreground mb-3">
            خلية منوية تم اكتشافها
          </div>
          <div className={`flex items-center justify-center gap-2 ${countStatus.color}`}>
            <StatusIcon className="w-5 h-5" />
            <span className="font-medium">{countStatus.status}</span>
          </div>
        </div>

        {/* Analysis Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.confidence && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">دقة التحليل</span>
                <span className="font-bold text-lg">{Math.round(result.confidence)}%</span>
              </div>
              <Progress value={result.confidence} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {result.confidence >= 90 ? 'دقة عالية جداً' : 
                 result.confidence >= 80 ? 'دقة عالية' :
                 result.confidence >= 70 ? 'دقة جيدة' : 'دقة مقبولة'}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">تفاصيل التحليل</span>
            </div>
            <div className="space-y-2">
              {result.analysis_time && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">وقت التحليل</span>
                  </div>
                  <Badge variant="secondary">{result.analysis_time.toFixed(1)}s</Badge>
                </div>
              )}

              {result.image_quality && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">جودة الصورة</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getQualityColor(result.image_quality)} text-white border-0`}
                  >
                    {getQualityLabel(result.image_quality)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Reference */}
        <div className="p-4 bg-muted/50 rounded-lg border border-primary/10">
          <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            المرجع الطبي
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            التركيز الطبيعي للحيوانات المنوية: 15+ مليون/مل أو أكثر. هذا التحليل لأغراض البحث فقط 
            ولا يجب أن يحل محل التقييم الطبي المهني. يُنصح بمراجعة أخصائي للحصول على تشخيص دقيق.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
