import { AppView } from '../../App'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  ChartBarIcon, 
  CpuChipIcon, 
  PlayIcon, 
  ChartPieIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  CogIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
  strategyCount: number
}

export function Sidebar({ currentView, onViewChange, strategyCount }: SidebarProps) {
  
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'strategies', label: 'Strategy Generator', icon: CpuChipIcon, badge: strategyCount },
    { id: 'backtest', label: 'Backtesting', icon: ChartBarIcon },
    { id: 'live', label: 'Live Trading', icon: PlayIcon },
    { id: 'portfolio', label: 'Portfolio', icon: ChartPieIcon },
    { id: 'analysis', label: 'Market Analysis', icon: MagnifyingGlassIcon },
    { id: 'settings', label: 'API Settings', icon: CogIcon },
  ] as const

  return (
    <>
      <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">AI Trader</h1>
          <p className="text-sm text-muted-foreground mt-1">Algorithmic Trading Platform</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start h-auto py-3 px-4"
                onClick={() => onViewChange(item.id as AppView)}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-border space-y-3">          
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Status</span>
              <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AI Engine Active</p>
          </div>
        </div>
      </div>
    </>
  )
}