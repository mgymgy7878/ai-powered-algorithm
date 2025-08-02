import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompactModuleProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
  className?: string;
  badge?: string;
}

const variantStyles = {
  default: 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800',
  success: 'bg-green-50 hover:bg-green-100 border-green-400 text-green-800',
  warning: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-400 text-yellow-800',
  danger: 'bg-red-50 hover:bg-red-100 border-red-400 text-red-800',
  info: 'bg-blue-50 hover:bg-blue-100 border-blue-400 text-blue-800'
};

const valueVariantStyles = {
  default: 'text-gray-900',
  success: 'text-green-700',
  warning: 'text-yellow-700',
  danger: 'text-red-700',
  info: 'text-blue-700'
};

export const CompactModule: React.FC<CompactModuleProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  onClick,
  className,
  badge
}) => {
  const isClickable = !!onClick;

  return (
    <Card 
      className={cn(
        'px-2 py-2 min-h-[68px] max-h-[68px] transition-all duration-200 cursor-pointer select-none border shadow-sm overflow-hidden',
        variantStyles[variant],
        isClickable && 'hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Üst kısım: Başlık ve ikon */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {icon && (
              <div className="flex-shrink-0 w-3.5 h-3.5">
                {icon}
              </div>
            )}
            <h3 className="text-[11px] font-semibold leading-tight truncate">
              {title}
            </h3>
          </div>
          
          {badge && (
            <Badge variant="outline" className="text-[9px] h-3.5 px-1.5 py-0 leading-none">
              {badge}
            </Badge>
          )}
        </div>
        
        {/* Alt kısım: Değer ve alt başlık */}
        <div className="flex items-end justify-between gap-1">
          <div className="min-w-0 flex-1">
            {subtitle && (
              <p className="text-[9px] text-muted-foreground/80 leading-tight truncate mb-0.5">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex-shrink-0 text-right">
            <span className={cn(
              'text-sm font-bold leading-none whitespace-nowrap',
              valueVariantStyles[variant]
            )}>
              {value}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};