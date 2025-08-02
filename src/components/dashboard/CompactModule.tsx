import { useState } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ChevronRight, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompactModuleProps {
  title: string
  value: string | number
  subtitle?: string
  status?: 'positive' | 'negative' | 'neutral' | 'warning'
  badge?: string
  icon?: React.ReactNode
  onClick?: () => void
  loading?: boolean
}

export function CompactModule({
  title,
  value,
  subtitle,
  status = 'neutral',
  badge,
  icon,
  onClick,
  loading = false
}: CompactModuleProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'text-green-600 border-green-200 bg-green-50/50'
      case 'negative':
        return 'text-red-600 border-red-200 bg-red-50/50'
      case 'warning':
        return 'text-yellow-600 border-yellow-200 bg-yellow-50/50'
      default:
        return 'text-primary border-border bg-muted/30'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'positive':
        return <TrendingUp className="w-3 h-3" />
      case 'negative':
        return <TrendingDown className="w-3 h-3" />
      case 'warning':
        return <AlertTriangle className="w-3 h-3" />
      default:
        return icon
    }
  }

  return (
    <Card
      className={cn(
        "h-16 p-3 cursor-pointer transition-all duration-200 border hover:shadow-sm",
        getStatusColor(),
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* İkon */}
          <div className="flex-shrink-0">
            {loading ? (
              <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent" />
            ) : (
              getStatusIcon()
            )}
          </div>

          {/* İçerik */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-medium text-muted-foreground truncate">
                {title}
              </h4>
              {badge && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                  {badge}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold truncate">
                {loading ? '...' : value}
              </span>
              {subtitle && (
                <span className="text-[10px] text-muted-foreground truncate">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sağ ok */}
        {onClick && (
          <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0 ml-1" />
        )}
      </div>
    </Card>
  )
}