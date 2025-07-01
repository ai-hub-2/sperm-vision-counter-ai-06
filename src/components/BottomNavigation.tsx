
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, FlaskConical, BarChart3, TrendingUp, Settings, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  labelAr: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    icon: Home,
    label: 'Home',
    labelAr: 'الرئيسية'
  },
  {
    href: '/analysis',
    icon: FlaskConical,
    label: 'Analysis',
    labelAr: 'التحليل'
  },
  {
    href: '/graphs',
    icon: BarChart3,
    label: 'Graphs',
    labelAr: 'الرسوم'
  },
  {
    href: '/analytics',
    icon: TrendingUp,
    label: 'Analytics',
    labelAr: 'التحليلات'
  },
  {
    href: '/live-test',
    icon: Video,
    label: 'Live Test',
    labelAr: 'اختبار مباشر'
  },
  {
    href: '/settings',
    icon: Settings,
    label: 'Settings',
    labelAr: 'الإعدادات'
  }
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D1B2A]/95 backdrop-blur-sm border-t border-[#00B4D8]/20 shadow-2xl">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all duration-300 min-w-[60px] relative",
                isActive 
                  ? "text-[#00B4D8] bg-[#00B4D8]/15 shadow-lg scale-105" 
                  : "text-gray-400 hover:text-[#00B4D8] hover:bg-[#00B4D8]/10"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#00B4D8] rounded-full animate-pulse" />
              )}
              <Icon className={cn(
                "w-4 h-4 mb-1 transition-all duration-300",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium leading-none transition-all duration-300",
                isActive && "font-semibold"
              )}>
                {item.labelAr}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
