
import React from 'react';
import { Monitor, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';

interface AppSettingsProps {
  settings: any;
  onSettingsChange: (newSettings: any) => void;
}

export const AppSettings: React.FC<AppSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const { theme, setTheme } = useTheme();

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          إعدادات التطبيق
        </CardTitle>
        <CardDescription>
          تخصيص واجهة المستخدم والتفضيلات العامة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              الوضع المظلم
            </h4>
            <p className="text-sm text-muted-foreground">
              تبديل بين الوضع المظلم والفاتح
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="capitalize"
          >
            {theme === 'dark' ? 'مظلم' : 'فاتح'}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">حفظ النتائج تلقائياً</h4>
            <p className="text-sm text-muted-foreground">
              حفظ نتائج التحليل في المتصفح
            </p>
          </div>
          <Switch
            checked={settings.saveResults}
            onCheckedChange={(checked) => updateSetting('saveResults', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">الإشعارات الصوتية</h4>
            <p className="text-sm text-muted-foreground">
              تشغيل صوت عند انتهاء التحليل
            </p>
          </div>
          <Switch
            checked={settings.soundNotifications}
            onCheckedChange={(checked) => updateSetting('soundNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">جودة التحليل العالية</h4>
            <p className="text-sm text-muted-foreground">
              استخدام خوارزميات أكثر دقة (أبطأ)
            </p>
          </div>
          <Switch
            checked={settings.highQualityAnalysis}
            onCheckedChange={(checked) => updateSetting('highQualityAnalysis', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
