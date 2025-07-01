
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { AnalysisSettings } from '@/components/settings/AnalysisSettings';
import { AppSettings } from '@/components/settings/AppSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { ActionButtons } from '@/components/settings/ActionButtons';

const Settings = () => {
  const { user, userSettings, updateSettings, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    autoAnalysis: true,
    saveResults: true,
    soundNotifications: false,
    analysisQuality: [85],
    videoFps: [30],
    maxFileSize: [100],
    highQualityAnalysis: false
  });

  // إعادة توجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجل دخول
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // تحميل الإعدادات من قاعدة البيانات
  useEffect(() => {
    if (userSettings) {
      setSettings({
        autoAnalysis: userSettings.auto_analysis,
        saveResults: userSettings.save_results,
        soundNotifications: userSettings.sound_notifications,
        analysisQuality: [userSettings.analysis_quality],
        videoFps: [userSettings.video_fps],
        maxFileSize: [userSettings.max_file_size],
        highQualityAnalysis: userSettings.high_quality_analysis
      });
    }
  }, [userSettings]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لحفظ الإعدادات",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateSettings({
        auto_analysis: settings.autoAnalysis,
        save_results: settings.saveResults,
        sound_notifications: settings.soundNotifications,
        analysis_quality: settings.analysisQuality[0],
        video_fps: settings.videoFps[0],
        max_file_size: settings.maxFileSize[0],
        high_quality_analysis: settings.highQualityAnalysis
      });

      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ جميع الإعدادات بنجاح في قاعدة البيانات"
      });
    } catch (error: any) {
      toast({
        title: "فشل حفظ الإعدادات",
        description: error.message || "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    }
  };

  const handleReset = async () => {
    const defaultSettings = {
      autoAnalysis: true,
      saveResults: true,
      soundNotifications: false,
      analysisQuality: [85],
      videoFps: [30],
      maxFileSize: [100],
      highQualityAnalysis: false
    };
    
    setSettings(defaultSettings);

    if (user) {
      try {
        await updateSettings({
          auto_analysis: true,
          save_results: true,
          sound_notifications: false,
          analysis_quality: 85,
          video_fps: 30,
          max_file_size: 100,
          high_quality_analysis: false
        });

        toast({
          title: "تم إعادة تعيين الإعدادات",
          description: "تم استعادة الإعدادات الافتراضية وحفظها"
        });
      } catch (error: any) {
        toast({
          title: "فشل إعادة التعيين",
          description: error.message || "حدث خطأ أثناء إعادة تعيين الإعدادات",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // سيتم إعادة التوجيه تلقائياً
  }

  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          <AnalysisSettings 
            settings={settings} 
            onSettingsChange={setSettings} 
          />
          
          <AppSettings 
            settings={settings} 
            onSettingsChange={setSettings} 
          />
          
          <NotificationSettings />

          <ActionButtons 
            onSave={handleSave} 
            onReset={handleReset} 
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
