
import React, { useCallback, useState } from 'react';
import { Upload, FileVideo, Image, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  isProcessing
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    const supportedTypes = [
      'video/mp4', 'video/avi', 'video/mov', 'video/webm',
      'image/jpeg', 'image/jpg', 'image/png', 'image/bmp'
    ];

    if (file.size > maxSize) {
      return 'حجم الملف كبير جداً. الحد الأقصى 500 ميجابايت';
    }

    if (!supportedTypes.includes(file.type)) {
      return 'نوع الملف غير مدعوم. يرجى اختيار صورة أو فيديو';
    }

    return null;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const files = Array.from(e.dataTransfer.files);
      const file = files[0];
      
      if (file) {
        const error = validateFile(file);
        if (error) {
          alert(error);
          return;
        }
        
        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              onFileSelect(file);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const error = validateFile(file);
        if (error) {
          alert(error);
          return;
        }
        
        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              onFileSelect(file);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
      }
      
      // Reset input
      e.target.value = '';
    },
    [onFileSelect]
  );

  const clearFile = () => {
    onFileSelect(null);
    setUploadProgress(0);
  };

  const getFileIcon = (file: File) => {
    return file.type.startsWith('video/') ? FileVideo : Image;
  };

  const getFileTypeLabel = (file: File) => {
    return file.type.startsWith('video/') ? 'فيديو' : 'صورة';
  };

  return (
    <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
          isDragOver ? "border-primary bg-primary/10 scale-[1.02] shadow-lg" : "border-muted-foreground/30",
          selectedFile ? "border-primary bg-primary/5" : "",
          isProcessing && "opacity-50 pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
      >
        {uploadProgress > 0 && uploadProgress < 100 ? (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/20 border-2 border-primary/30">
              <Upload className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">جاري رفع الملف...</h3>
              <Progress value={uploadProgress} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-500/20 border-2 border-green-500/30">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-1 truncate">{selectedFile.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {getFileTypeLabel(selectedFile)}
              </p>
              
              {/* File preview if image */}
              {selectedFile.type.startsWith('image/') && (
                <div className="mt-4 mb-4">
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Preview" 
                    className="max-w-full max-h-32 mx-auto rounded-lg border border-primary/20"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFile}
                disabled={isProcessing}
                className="gap-2 max-w-fit mx-auto hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              >
                <X className="w-4 h-4" />
                إزالة الملف
              </Button>
              <p className="text-xs text-muted-foreground text-green-600">
                ✓ الملف جاهز للتحليل
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-primary/10 border-2 border-primary/20 animate-glow">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                رفع الوسائط للتحليل
              </h3>
              <p className="text-muted-foreground mb-4">
                اسحب وأفلت ملف الفيديو أو الصورة هنا، أو اضغط للتصفح
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-sm mb-4">
                <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full">MP4</span>
                <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full">AVI</span>
                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full">JPG</span>
                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full">PNG</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                الحد الأقصى لحجم الملف: 500 ميجابايت
              </p>
            </div>
            
            <div className="space-y-3">
              <input
                type="file"
                accept="video/*,image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="medical" size="lg" className="cursor-pointer px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Upload className="w-5 h-5 mr-2" />
                  اختيار ملف
                </Button>
              </label>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  أو استخدم الكاميرا لالتقاط عينة مباشرة
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-primary/20 border-2 border-primary border-dashed rounded-xl flex items-center justify-center backdrop-blur-sm">
            <div className="text-center animate-pulse">
              <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-primary font-medium text-lg">أفلت الملف هنا</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
