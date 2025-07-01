
import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <div className="mt-12 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-6">
      <p className="font-medium mb-2">
        هذا التطبيق يستخدم الذكاء الاصطناعي لأغراض البحث فقط
      </p>
      <p>
        النتائج لا يجب أن تحل محل التقييم الطبي المتخصص. 
        جميع البيانات محفوظة محلياً ولا يتم مشاركتها.
      </p>
    </div>
  );
};
