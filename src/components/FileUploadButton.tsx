
import React, { useRef } from 'react';
import { Upload, FileVideo, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  variant?: 'default' | 'outline' | 'medical';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  accept = "video/*,image/*",
  maxSizeMB = 500,
  variant = 'medical',
  size = 'lg',
  className = '',
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "حجم الملف كبير جداً",
        description: `حجم الملف ${fileSizeMB.toFixed(1)} ميجابايت، والحد الأقصى ${maxSizeMB} ميجابايت`,
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      toast({
        title: "نوع الملف غير مدعوم",
        description: "يرجى اختيار ملف فيديو أو صورة",
        variant: "destructive"
      });
      return;
    }

    onFileSelect(file);
    
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast({
      title: "تم تحديد الملف بنجاح",
      description: `${isVideo ? 'فيديو' : 'صورة'} - ${file.name}`,
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />
      <Button
        onClick={handleButtonClick}
        variant={variant}
        size={size}
        className={`gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      >
        <Upload className="w-5 h-5" />
        {children || 'رفع ملف'}
      </Button>
    </>
  );
};
