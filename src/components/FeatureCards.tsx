
import React from 'react';
import { Brain, Zap, Microscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader>
          <Brain className="w-10 h-10 text-primary mx-auto mb-2" />
          <CardTitle className="text-lg">كشف بالذكاء الاصطناعي</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            نموذج YOLOv8 المتقدم لكشف وعد الحيوانات المنوية بدقة عالية
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="text-center border-accent/20 hover:border-accent/40 transition-colors">
        <CardHeader>
          <Zap className="w-10 h-10 text-accent mx-auto mb-2" />
          <CardTitle className="text-lg">تحليل في الوقت الفعلي</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            معالجة سريعة للفيديوهات والصور مع نتائج فورية ودرجات ثقة
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader>
          <Microscope className="w-10 h-10 text-primary mx-auto mb-2" />
          <CardTitle className="text-lg">جودة طبية</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            أدوات تحليل احترافية مصممة للبحث والتطبيقات الطبية
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};
