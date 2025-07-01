
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/AppHeader';
import { FeatureCards } from '@/components/FeatureCards';
import { UploadSection } from '@/components/UploadSection';
import { MediaPreview } from '@/components/MediaPreview';
import { TipsCard } from '@/components/TipsCard';
import { AppFooter } from '@/components/AppFooter';
import { CameraCapture } from '@/components/CameraCapture';
import { Button } from '@/components/ui/button';
import { LogIn, Zap } from 'lucide-react';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    }
  };

  const handleCameraCapture = (file: File) => {
    handleFileSelect(file);
    setShowCamera(false);
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
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

    // Navigate to analysis page with the selected file
    navigate('/analysis', { state: { file: selectedFile } });
  };

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول، عرض دعوة لتسجيل الدخول
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">مرحباً بك في SpermVision AI</h2>
          <p className="text-gray-400">يرجى تسجيل الدخول للوصول إلى جميع الميزات</p>
          <Button onClick={() => navigate('/auth')} size="lg" className="bg-[#00B4D8] hover:bg-[#00B4D8]/80">
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
    <div className="min-h-screen bg-[#0D1B2A]">
      <AppHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="animate-slide-up">
          <FeatureCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <UploadSection
              selectedFile={selectedFile}
              isAnalyzing={false}
              onFileSelect={handleFileSelect}
              onCameraClick={() => setShowCamera(true)}
              onAnalyze={handleAnalyze}
            />
            
            {/* Start Analysis Button - Show when file is selected */}
            {selectedFile && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleAnalyze}
                  className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  بدء التحليل
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <MediaPreview file={selectedFile} isAnalyzing={false} />
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
