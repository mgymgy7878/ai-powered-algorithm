import { Button } from '../../ui/button'
import { Plus, Play, BarChart, Brain, Settings, Zap } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  variant: 'default' | 'secondary' | 'outline'
  color?: string
}

export function QuickActionsPanel() {
  const actions: QuickAction[] = [
    {
      id: '1',
      label: 'Yeni Strateji',
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        // Navigate to strategy creation
        window.dispatchEvent(new CustomEvent('navigate-to-strategies'))
      },
      variant: 'default'
    },
    {
      id: '2',
      label: 'Backtest Başlat',
      icon: <BarChart className="h-4 w-4" />,
      action: () => {
        // Navigate to backtesting
        window.dispatchEvent(new CustomEvent('navigate-to-backtest'))
      },
      variant: 'outline'
    },
    {
      id: '3',
      label: 'Canlı Trading',
      icon: <Play className="h-4 w-4" />,
      action: () => {
        // Navigate to live trading
        window.dispatchEvent(new CustomEvent('navigate-to-live'))
      },
      variant: 'secondary',
      color: 'bg-green-100 hover:bg-green-200 text-green-700'
    },
    {
      id: '4',
      label: 'AI Tahmini',
      icon: <Brain className="h-4 w-4" />,
      action: () => {
        // Trigger AI prediction
        console.log('AI prediction requested')
      },
      variant: 'outline',
      color: 'bg-purple-100 hover:bg-purple-200 text-purple-700'
    },
    {
      id: '5',
      label: 'Risk Analizi',
      icon: <Zap className="h-4 w-4" />,
      action: () => {
        // Show risk analysis
        console.log('Risk analysis requested')
      },
      variant: 'outline',
      color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
    },
    {
      id: '6',
      label: 'Ayarlar',
      icon: <Settings className="h-4 w-4" />,
      action: () => {
        // Navigate to settings
        window.dispatchEvent(new CustomEvent('navigate-to-settings'))
      },
      variant: 'outline'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant}
          size="sm"
          onClick={action.action}
          className={`h-auto py-3 px-4 flex flex-col items-center gap-2 text-xs ${
            action.color || ''
          }`}
        >
          {action.icon}
          <span className="font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  )
}