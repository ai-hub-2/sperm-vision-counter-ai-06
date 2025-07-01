
import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const NotificationSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          الإشعارات والتنبيهات
        </CardTitle>
        <CardDescription>
          إدارة التنبيهات والإشعارات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">معلومات مهمة</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• هذا التطبيق مخصص للأغراض البحثية فقط</li>
            <li>• النتائج لا تحل محل الفحص الطبي المتخصص</li>
            <li>• يتم حفظ البيانات محلياً في متصفحك فقط</li>
            <li>• لا نقوم بجمع أو مشاركة بياناتك الشخصية</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
