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
  default: 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700',
  success: 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800',
  warning: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800',
  danger: 'bg-red-100 hover:bg-red-200 border-red-300 text-red-800',
  info: 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800'
};

const valueVariantStyles = {
  default: 'text-gray-900',
  success: 'text-green-900',
  warning: 'text-yellow-900',
  danger: 'text-red-900',
  info: 'text-blue-900'
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
        'p-3 min-h-[60px] h-[60px] transition-all duration-200 cursor-pointer select-none border shadow-sm',
        variantStyles[variant],
        isClickable && 'hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && (
            <div className="flex-shrink-0 w-4 h-4">
              {icon}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-semibold truncate">
                {title}
              </h3>
              {badge && (
                <Badge variant="outline" className="text-[10px] h-4 px-1">
                  {badge}
                </Badge>
              )}
            </div>
            
            {subtitle && (
              <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <span className={cn(
            'text-sm font-bold',
            valueVariantStyles[variant]
          )}>
            {value}
          </span>
        </div>
      </div>
    </Card>
  );
};