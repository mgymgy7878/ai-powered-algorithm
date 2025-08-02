import { useState, useEffect, useMemo, useCallback } from 'react'
import React from 'react'
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
  TestTube,
  Wifi
} from 'lucide-react'

interface SidebarProps {
  currentView: AppView
  onViewChange: (view: AppView) => void
  strategyCount: number
  runningStrategiesCount?: number
}

interface NavigationItem {
  id: AppView
  label: string
  icon: any
  badge?: number
}

export function Sidebar({ currentView, onViewChange, strategyCount = 0, runningStrategiesCount = 0 }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Memoize navigation items to prevent unnecessary re-renders
  const navigation = useMemo<NavigationItem[]>(() => {
    const items = [
      { id: 'dashboard', label: 'Anasayfa', icon: Home },
      { id: 'strategies', label: 'Stratejiler', icon: Cpu, badge: strategyCount || 0 },
      { id: 'live', label: 'Çalışan Stratejiler', icon: Rocket, badge: runningStrategiesCount || 0 },
      { id: 'backtest', label: 'Backtesting', icon: BarChart },
      { id: 'portfolio', label: 'Portföy', icon: PieChart },
      { id: 'analysis', label: 'Piyasa Analizi', icon: Search },
      { id: 'economic', label: 'Ekonomik Takvim', icon: Calendar },
      { id: 'summary', label: '📊 Özet', icon: FileText },
      { id: 'project-analysis', label: '📋 Proje Durumu', icon: ClipboardCheck },
      { id: 'test', label: '🧪 Test', icon: TestTube },
      { id: 'websocket-test', label: '📡 WebSocket Test', icon: Wifi },
      { id: 'settings', label: 'API Ayarları', icon: Settings },
    ] as NavigationItem[]
    
    console.log('🔍 Navigation Items:', items.map(item => `${item.id} -> ${item.label}`))
    return items
  }, [strategyCount, runningStrategiesCount])
  
  // Debug: Sidebar durumunu logla
  useEffect(() => {
    console.log('🔍 Sidebar Debug:', {
      isOpen: isSidebarOpen,
      currentView,
      navigationItems: navigation.length
    })
  }, [isSidebarOpen, currentView, navigation])
  
  // Memoize the toggle handler
  const handleToggle = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])
  
  // Optimized sidebar state event dispatch
  useEffect(() => {
    const event = new CustomEvent('sidebar-toggle', { detail: { isOpen: isSidebarOpen } })
    window.dispatchEvent(event)
  }, [isSidebarOpen])

  // Memoize the navigation click handler
  const handleNavigation = useCallback((viewId: AppView) => {
    if (currentView !== viewId) {
      onViewChange(viewId)
    }
  }, [currentView, onViewChange])

  return (
    <>
      {/* Toggle Button - Her zaman görünür */}
      <Button
        onClick={handleToggle}
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-[100] bg-card border border-border shadow-lg hover:bg-muted hover:shadow-xl transition-all"
        title={isSidebarOpen ? 'Menüyü Gizle' : 'Menüyü Göster'}
        aria-label={isSidebarOpen ? 'Menüyü Gizle' : 'Menüyü Göster'}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
        <span className="absolute top-full left-0 mt-1 text-xs bg-red-500 text-white px-1 rounded">
          {isSidebarOpen ? 'AÇIK' : 'KAPALI'}
        </span>
      </Button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-r border-border h-screen flex flex-col`}>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">AI Trader</h1>
          <p className="text-sm text-muted-foreground mt-1">Algoritmik Trading Platformu</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Ana navigasyon">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <NavigationButton
                key={item.id}
                item={item}
                isActive={isActive}
                onClick={handleNavigation}
              />
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-border space-y-3">          
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sistem Durumu</span>
              <div className="h-2 w-2 bg-accent rounded-full animate-pulse" aria-label="Aktif durum göstergesi"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AI Motor Aktif</p>
          </div>
        </div>
      </div>
    </>
  )
}

// Memoized Navigation Button Component for better performance
const NavigationButton = React.memo<{
  item: NavigationItem
  isActive: boolean
  onClick: (viewId: AppView) => void
}>(({ item, isActive, onClick }) => {
  const Icon = item.icon
  
  const handleClick = useCallback(() => {
    console.log(`🔗 Navigation clicked: ${item.id} -> ${item.label}`)
    onClick(item.id)
  }, [item.id, onClick])
  
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className="w-full justify-start h-auto py-3 px-4"
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      title={item.label}
    >
      <Icon className="h-5 w-5 mr-3" aria-hidden="true" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <Badge variant="secondary" className="ml-2" aria-label={`${item.badge} adet`}>
          {item.badge}
        </Badge>
      )}
    </Button>
  )
})