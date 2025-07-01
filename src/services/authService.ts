
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserSettings {
  auto_analysis: boolean;
  analysis_quality: number;
  video_fps: number;
  max_file_size: number;
  save_results: boolean;
  sound_notifications: boolean;
  high_quality_analysis: boolean;
}

class AuthService {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) throw error;

    // إنشاء إعدادات افتراضية للمستخدم الجديد
    if (data.user) {
      await this.createDefaultSettings(data.user.id);
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  private async createDefaultSettings(userId: string): Promise<void> {
    const defaultSettings = {
      auto_analysis: true,
      analysis_quality: 85,
      video_fps: 30,
      max_file_size: 100,
      save_results: true,
      sound_notifications: true,
      high_quality_analysis: false
    };

    // حفظ في localStorage كبديل مؤقت
    localStorage.setItem(`user_settings_${userId}`, JSON.stringify(defaultSettings));
  }

  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      // محاولة جلب من localStorage
      const stored = localStorage.getItem(`user_settings_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }

      // إنشاء إعدادات افتراضية إذا لم توجد
      const defaultSettings: UserSettings = {
        auto_analysis: true,
        analysis_quality: 85,
        video_fps: 30,
        max_file_size: 100,
        save_results: true,
        sound_notifications: true,
        high_quality_analysis: false
      };

      await this.createDefaultSettings(userId);
      return defaultSettings;
    } catch (error: any) {
      console.error('Error getting user settings:', error);
      return null;
    }
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    try {
      // تحديث localStorage
      const currentSettings = await this.getUserSettings(userId);
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(`user_settings_${userId}`, JSON.stringify(updatedSettings));
    } catch (error: any) {
      throw new Error(`فشل في تحديث الإعدادات: ${error.message}`);
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
