
import React from 'react';
import { FileUpload } from '@/components/FileUpload';
import { CameraButton } from '@/components/CameraButton';
import { AnalysisButton } from '@/components/AnalysisButton';

interface UploadSectionProps {
  selectedFile: File | null;
  isAnalyzing: boolean;
  onFileSelect: (file: File | null) => void;
  onCameraClick: () => void;
  onAnalyze: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  selectedFile,
  isAnalyzing,
  onFileSelect,
  onCameraClick,
  onAnalyze
}) => {
  return (
    <div className="space-y-6">
      <FileUpload
        onFileSelect={onFileSelect}
        selectedFile={selectedFile}
        isProcessing={isAnalyzing}
      />
      
      {selectedFile ? (
        <div className="flex justify-center">
          <AnalysisButton 
            isAnalyzing={isAnalyzing}
            onClick={onAnalyze}
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <CameraButton onClick={onCameraClick} />
        </div>
      )}
    </div>
  );
};
