
import React from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onReset }) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onSave} className="flex-1" size="lg">
        <Save className="w-4 h-4 mr-2" />
        حفظ الإعدادات
      </Button>
      <Button onClick={onReset} variant="outline" className="flex-1" size="lg">
        <RotateCcw className="w-4 h-4 mr-2" />
        إعادة تعيين
      </Button>
    </div>
  );
};
