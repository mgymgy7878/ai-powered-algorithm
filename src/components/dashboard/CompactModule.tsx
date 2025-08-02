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
  default: 'bg-gray-50 hover:bg-gray-100 border-gray-500 text-gray-900',
  success: 'bg-green-50/80 hover:bg-green-100 border-green-600 text-green-900',
  warning: 'bg-yellow-50/80 hover:bg-yellow-100 border-yellow-600 text-yellow-900',
  danger: 'bg-red-50/80 hover:bg-red-100 border-red-600 text-red-900',
  info: 'bg-blue-50/80 hover:bg-blue-100 border-blue-600 text-blue-900'
};

const valueVariantStyles = {
  default: 'text-gray-800',
  success: 'text-green-800',
  warning: 'text-yellow-800',
  danger: 'text-red-800',
  info: 'text-blue-800'
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
        'px-2 py-1.5 transition-all duration-200 cursor-pointer select-none border shadow-sm overflow-hidden flex',
        variantStyles[variant],
        isClickable && 'hover:shadow-md hover:scale-[1.02] hover:z-10',
        // Daha esnek varsayılan boyut
        !className?.includes('h-') && 'h-[50px]',
        !className?.includes('w-') && 'min-w-[140px]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full justify-between w-full">
        {/* Üst kısım: Başlık ve ikon */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {icon && (
              <div className="flex-shrink-0">
                {icon}
              </div>
            )}
            <h3 className="text-[9px] font-semibold leading-tight truncate text-left" title={title}>
              {title}
            </h3>
          </div>
          
          {badge && (
            <Badge variant="outline" className="text-[7px] h-3 px-1 py-0 leading-none bg-white/90 border-current">
              {badge}
            </Badge>
          )}
        </div>
        
        {/* Orta kısım: Ana değer */}
        <div className="flex-1 flex items-center justify-center">
          <span 
            className={cn(
              // Dinamik yazı boyutları - yüksekliğe göre adapte edilir
              className?.includes('h-[31px]') ? 'text-xs' : 
              className?.includes('h-[22px]') ? 'text-[10px]' : 'text-sm',
              'font-bold leading-none text-center',
              valueVariantStyles[variant]
            )}
            title={String(value)}
          >
            {value}
          </span>
        </div>
        
        {/* Alt kısım: Alt başlık - sadece yeterli alan varsa */}
        {subtitle && (
          <div className="mt-1">
            <p className={cn(
              // Kutu yüksekliğine göre alt başlık boyutu
              className?.includes('h-[31px]') ? 'text-[8px]' : 
              className?.includes('h-[22px]') ? 'text-[7px]' : 'text-xs',
              'text-muted-foreground/70 leading-tight truncate text-center'
            )} title={subtitle}>
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};