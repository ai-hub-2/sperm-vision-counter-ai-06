
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, BarChart3, Settings, TrendingUp } from 'lucide-react';
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
    href: '/analysis-results',
    icon: BarChart3,
    label: 'Results',
    labelAr: 'النتائج'
  },
  {
    href: '/analytics',
    icon: TrendingUp,
    label: 'Analytics',
    labelAr: 'التحليلات'
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-primary/20 shadow-2xl">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 min-w-[70px] relative",
                isActive 
                  ? "text-primary bg-primary/15 shadow-lg scale-105" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-all duration-300",
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
