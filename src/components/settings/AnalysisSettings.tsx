
import React from 'react';
import { Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface AnalysisSettingsProps {
  settings: any;
  onSettingsChange: (newSettings: any) => void;
}

export const AnalysisSettings: React.FC<AnalysisSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          إعدادات التحليل
        </CardTitle>
        <CardDescription>
          تخصيص عملية التحليل والكشف
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">التحليل التلقائي</h4>
            <p className="text-sm text-muted-foreground">
              بدء التحليل تلقائياً عند رفع الملف
            </p>
          </div>
          <Switch
            checked={settings.autoAnalysis}
            onCheckedChange={(checked) => updateSetting('autoAnalysis', checked)}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">جودة التحليل</h4>
            <span className="text-sm text-muted-foreground">
              {settings.analysisQuality[0]}%
            </span>
          </div>
          <Slider
            value={settings.analysisQuality}
            onValueChange={(value) => updateSetting('analysisQuality', value)}
            max={100}
            min={50}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            جودة أعلى = دقة أكبر لكن وقت أطول
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">معدل الإطارات للفيديو</h4>
            <span className="text-sm text-muted-foreground">
              {settings.videoFps[0]} fps
            </span>
          </div>
          <Slider
            value={settings.videoFps}
            onValueChange={(value) => updateSetting('videoFps', value)}
            max={60}
            min={15}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">الحد الأقصى لحجم الملف</h4>
            <span className="text-sm text-muted-foreground">
              {settings.maxFileSize[0]} MB
            </span>
          </div>
          <Slider
            value={settings.maxFileSize}
            onValueChange={(value) => updateSetting('maxFileSize', value)}
            max={500}
            min={10}
            step={10}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
