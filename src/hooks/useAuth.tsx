
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, UserSettings } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userSettings: UserSettings | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // إعداد مستمع حالة المصادقة
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const settings = await authService.getUserSettings(session.user.id);
            setUserSettings(settings);
          } catch (error) {
            console.error('Error loading user settings:', error);
          }
        } else {
          setUserSettings(null);
        }
        
        setLoading(false);
      }
    );

    // التحقق من الجلسة الحالية
    authService.getCurrentSession().then(session => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    await authService.signUp(email, password);
  };

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const updateSettings = async (settings: Partial<UserSettings>) => {
    if (!user) throw new Error('المستخدم غير مسجل دخول');
    
    await authService.updateUserSettings(user.id, settings);
    
    // تحديث الإعدادات المحلية
    setUserSettings(prev => prev ? { ...prev, ...settings } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userSettings,
      loading,
      signUp,
      signIn,
      signOut,
      updateSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
