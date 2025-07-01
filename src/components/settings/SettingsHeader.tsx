
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export const SettingsHeader: React.FC = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الإعدادات</h1>
            <p className="text-muted-foreground">تخصيص إعدادات التطبيق والتحليل</p>
          </div>
        </div>
      </div>
    </header>
  );
};
