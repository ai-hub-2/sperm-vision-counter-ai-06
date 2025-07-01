
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { analysisService, AnalysisResult } from '@/services/analysisService';
import { AppHeader } from '@/components/AppHeader';
import { FeatureCards } from '@/components/FeatureCards';
import { UploadSection } from '@/components/UploadSection';
import { MediaPreview } from '@/components/MediaPreview';
import { TipsCard } from '@/components/TipsCard';
import { AppFooter } from '@/components/AppFooter';
import { CameraCapture } from '@/components/CameraCapture';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userSettings, loading } = useAuth();

  // إعادة توجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجل دخول
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleFileSelect = (file: File | null) => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول لرفع الملفات",
        variant: "destructive"
      });
      return;
    }

    // التحقق من حجم الملف بناءً على إعدادات المستخدم
    if (file && userSettings) {
      const maxSizeMB = userSettings.max_file_size;
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > maxSizeMB) {
        toast({
          title: "الملف كبير جداً",
          description: `حجم الملف ${fileSizeMB.toFixed(1)} ميجابايت، والحد الأقصى ${maxSizeMB} ميجابايت`,
          variant: "destructive"
        });
        return;
      }
    }

    setSelectedFile(file);
    if (file) {
      setShowCamera(false);
      toast({
        title: "تم تحديد الملف",
        description: "يمكنك الآن بدء التحليل"
      });

      // التحليل التلقائي إذا كان مفعلاً في الإعدادات
      if (userSettings?.auto_analysis) {
        handleAnalyze(file);
      }
    }
  };

  const handleCameraCapture = (file: File) => {
    setSelectedFile(file);
    setShowCamera(false);
  };

  const handleAnalyze = async (fileToAnalyze?: File) => {
    const file = fileToAnalyze || selectedFile;
    
    if (!file) {
      toast({
        title: "لا يوجد ملف محدد",
        description: "يرجى اختيار ملف فيديو أو صورة للتحليل.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول لإجراء التحليل",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // رفع الملف أولاً
      await analysisService.uploadFile(file, user.id);
      
      // إجراء التحليل
      const result = await analysisService.analyzeFile(file);
      
      // حفظ النتائج إذا كان مفعلاً في الإعدادات
      let savedResult;
      if (userSettings?.save_results) {
        savedResult = await analysisService.saveAnalysisResult(user.id, file, result);
      }
      
      // تشغيل الإشعار الصوتي إذا كان مفعلاً
      if (userSettings?.sound_notifications) {
        // يمكن إضافة صوت الإشعار هنا
        console.log('Playing notification sound');
      }
      
      navigate('/analysis-results', {
        state: { 
          file, 
          result,
          savedResult: savedResult || null
        }
      });
      
      toast({
        title: "تم إكمال التحليل",
        description: "تم تحليل العينة بنجاح، اطلع على النتائج"
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "فشل التحليل",
        description: error.message || "حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول، عرض دعوة لتسجيل الدخول
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">مرحباً بك في SpermVision AI</h2>
          <p className="text-muted-foreground">يرجى تسجيل الدخول للوصول إلى جميع الميزات</p>
          <Button onClick={() => navigate('/auth')} size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="animate-slide-up">
          <FeatureCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <UploadSection
              selectedFile={selectedFile}
              isAnalyzing={isAnalyzing}
              onFileSelect={handleFileSelect}
              onCameraClick={() => setShowCamera(true)}
              onAnalyze={() => handleAnalyze()}
            />
          </div>

          <div className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <MediaPreview file={selectedFile} isAnalyzing={isAnalyzing} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <TipsCard />
            </div>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <AppFooter />
        </div>
      </div>
    </div>
  );
};

export default Index;
