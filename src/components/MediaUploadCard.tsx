
import React from 'react';
import { FileVideo, Image, Upload, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploadButton } from '@/components/FileUploadButton';
import { Button } from '@/components/ui/button';

interface MediaUploadCardProps {
  onFileSelect: (file: File) => void;
  onCameraClick: () => void;
  title?: string;
  description?: string;
}

export const MediaUploadCard: React.FC<MediaUploadCardProps> = ({
  onFileSelect,
  onCameraClick,
  title = "رفع الوسائط للتحليل",
  description = "اختر ملف فيديو أو صورة لتحليل الحيوانات المنوية"
}) => {
  return (
    <Card className="border-2 border-dashed border-primary/30 bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <Upload className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground text-sm">
          {description}
        </p>

        {/* Supported formats */}
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-1 bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs">
            <FileVideo className="w-3 h-3" />
            MP4, AVI, MOV
          </div>
          <div className="flex items-center gap-1 bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs">
            <Image className="w-3 h-3" />
            JPG, PNG, BMP
          </div>
        </div>

        {/* Upload buttons */}
        <div className="space-y-3">
          <FileUploadButton
            onFileSelect={onFileSelect}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            اختيار ملف من الجهاز
          </FileUploadButton>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">أو</span>
            </div>
          </div>

          <Button
            onClick={onCameraClick}
            variant="outline"
            size="lg"
            className="w-full gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
          >
            <Camera className="w-4 h-4" />
            استخدام الكاميرا
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          الحد الأقصى لحجم الملف: 500 ميجابايت
        </p>
      </CardContent>
    </Card>
  );
};
