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
  default: 'bg-gray-50 hover:bg-gray-100 border-gray-400 text-gray-900',
  success: 'bg-green-50 hover:bg-green-100 border-green-500 text-green-900',
  warning: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-500 text-yellow-900',
  danger: 'bg-red-50 hover:bg-red-100 border-red-500 text-red-900',
  info: 'bg-blue-50 hover:bg-blue-100 border-blue-500 text-blue-900'
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
        'px-2 py-1.5 min-h-[60px] max-h-[60px] transition-all duration-200 cursor-pointer select-none border-2 shadow-sm overflow-hidden',
        variantStyles[variant],
        isClickable && 'hover:shadow-md hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Üst kısım: Başlık ve ikon */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {icon && (
              <div className="flex-shrink-0 w-3 h-3">
                {icon}
              </div>
            )}
            <h3 className="text-[10px] font-bold leading-tight truncate">
              {title}
            </h3>
          </div>
          
          {badge && (
            <Badge variant="outline" className="text-[8px] h-3 px-1 py-0 leading-none bg-white/80">
              {badge}
            </Badge>
          )}
        </div>
        
        {/* Alt kısım: Değer ve alt başlık */}
        <div className="flex items-end justify-between gap-1">
          <div className="min-w-0 flex-1">
            {subtitle && (
              <p className="text-[8px] text-muted-foreground/90 leading-tight truncate mb-0.5" title={subtitle}>
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex-shrink-0 text-right">
            <span 
              className={cn(
                'text-sm font-bold leading-none whitespace-nowrap',
                valueVariantStyles[variant]
              )}
              title={String(value)}
            >
              {value}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};