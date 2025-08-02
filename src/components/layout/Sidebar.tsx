import { useState, useEffect } from 'react'
import { AppView } from '../../App'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  BarChart, 
  Cpu, 
  Play, 
  PieChart,
  Search,
  Home,
  Settings,
  Rocket,
  Brain,
  List,
  X,
  Calendar,
  ClipboardCheck,
  FileText,
  TestTube
} from 'lucide-react'

interface SidebarProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
  strategyCount: number
  runningStrategiesCount?: number
}

export function Sidebar({ currentView, onViewChange, strategyCount = 0, runningStrategiesCount = 0 }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Her zaman açık başlasın
  
  console.log('Sidebar - Current view:', currentView) // Debug için
  console.log('Sidebar - Is open:', isSidebarOpen) // Debug için
  
  // Sidebar durumunu window'a yayınla ki Dashboard bunu kullanabilsin
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isOpen: isSidebarOpen } }))
  }, [isSidebarOpen])
  
  const navigation = [
    { id: 'dashboard', label: 'Anasayfa', icon: Home },
    { id: 'strategies', label: 'Stratejiler', icon: Cpu, badge: strategyCount || 0 },
    { id: 'live', label: 'Çalışan Stratejiler', icon: Rocket, badge: runningStrategiesCount || 0 },
    { id: 'backtest', label: 'Backtesting', icon: BarChart },
    { id: 'portfolio', label: 'Portföy', icon: PieChart },
    { id: 'analysis', label: 'Piyasa Analizi', icon: Search },
    { id: 'economic', label: 'Ekonomik Takvim', icon: Calendar },
    { id: 'summary', label: '📊 Özet', icon: FileText }, // Emoji eklendi
    { id: 'project-analysis', label: '📋 Proje Durumu', icon: ClipboardCheck }, // Emoji eklendi  
    { id: 'test', label: '🧪 Test', icon: TestTube }, // Emoji eklendi
    { id: 'settings', label: 'API Ayarları', icon: Settings },
  ] as const
  
  console.log('Navigation items:', navigation.map(item => item.id)) // Debug için

  return (
    <>
      {/* Toggle Button - Her zaman görünür */}
      <Button
        onClick={() => {
          console.log('Toggle clicked, current state:', isSidebarOpen)
          setIsSidebarOpen(!isSidebarOpen)
        }}
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-[100] bg-card border border-border shadow-lg hover:bg-muted hover:shadow-xl transition-all"
        title={isSidebarOpen ? 'Menüyü Gizle' : 'Menüyü Göster'}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-r border-border h-screen flex flex-col`}>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">AI Trader</h1>
          <p className="text-sm text-muted-foreground mt-1">Algoritmik Trading Platformu</p>
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
                onClick={() => {
                  console.log('Navigating to:', item.id) // Debug log
                  console.log('Previous view:', currentView) // Debug log
                  onViewChange(item.id as AppView)
                  console.log('Navigation attempted to:', item.id) // Debug log
                }}
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
              <span className="text-sm font-medium">Sistem Durumu</span>
              <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AI Motor Aktif</p>
          </div>
        </div>
      </div>
    </>
  )
}