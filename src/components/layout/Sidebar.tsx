import { AppView } from '../../App'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  ChartBar, 
  Cpu, 
  Play, 
  ChartPie,
  MagnifyingGlass,
  House,
  Gear,
  Rocket,
  Brain
} from '@phosphor-icons/react'

interface SidebarProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
  strategyCount: number
  runningStrategiesCount?: number
}

export function Sidebar({ currentView, onViewChange, strategyCount, runningStrategiesCount = 0 }: SidebarProps) {
  
  const navigation = [
    { id: 'dashboard', label: 'Anasayfa', icon: House },
    { id: 'strategies', label: 'Stratejiler', icon: Cpu, badge: strategyCount },
    { id: 'live', label: 'Çalışan Stratejiler', icon: Rocket, badge: runningStrategiesCount },
    { id: 'backtest', label: 'Backtesting', icon: ChartBar },
    { id: 'portfolio', label: 'Portfolio', icon: ChartPie },
    { id: 'analysis', label: 'Market Analysis', icon: MagnifyingGlass },
    { id: 'settings', label: 'API Settings', icon: Gear },
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