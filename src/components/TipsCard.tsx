
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TipsCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="text-lg">نصائح للحصول على أفضل النتائج</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li>• استخدم إضاءة جيدة وواضحة</li>
          <li>• تأكد من وضوح الصورة أو الفيديو</li>
          <li>• تجنب الحركة المفرطة عند التسجيل</li>
          <li>• استخدم تكبير مناسب للعينة</li>
          <li>• اختر الجزء الأكثر وضوحاً في العينة</li>
        </ul>
      </CardContent>
    </Card>
  );
};
