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
  default: 'bg-muted/50 hover:bg-muted/70 border-border',
  success: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
  warning: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700',
  danger: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700',
  info: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
};

const valueVariantStyles = {
  default: 'text-foreground',
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
        'p-3 h-[60px] transition-all duration-200 cursor-pointer select-none',
        variantStyles[variant],
        isClickable && 'hover:shadow-sm',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && (
            <div className="flex-shrink-0 w-4 h-4 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-medium text-muted-foreground truncate">
                {title}
              </h3>
              {badge && (
                <Badge variant="outline" className="text-[10px] h-4 px-1">
                  {badge}
                </Badge>
              )}
            </div>
            
            {subtitle && (
              <p className="text-xs text-muted-foreground/70 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <span className={cn(
            'text-sm font-semibold',
            valueVariantStyles[variant]
          )}>
            {value}
          </span>
        </div>
      </div>
    </Card>
  );
};