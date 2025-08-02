import { useState, useEffect, useMemo, useCallback } from 'react'
import React from 'react'
import { AppView } from '../../App'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { debugLog } from '../../utils/debugUtils'
import { 
  BarChart, 
  Cpu, 
  PieChart,
  Search,
  Home,
  Settings,
  Rocket,
  List,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ClipboardCheck
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
  
  // Force sidebar open for debugging
  useEffect(() => {
    setIsSidebarOpen(true)
  }, [])
  
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
      { id: 'project-analysis', label: 'Proje Durumu', icon: ClipboardCheck },
      { id: 'settings', label: 'API Ayarları', icon: Settings },
    ] as NavigationItem[]
    
    debugLog('SIDEBAR_NAV', 'Navigation items created', items.map(item => `${item.id} -> ${item.label}`))
    return items
  }, [strategyCount, runningStrategiesCount])
  
  // Debug: Sidebar durumunu logla
  useEffect(() => {
    debugLog('SIDEBAR', 'Sidebar state updated', {
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
      {/* Toggle Button - Kompakt pozisyon */}
      <Button
        onClick={handleToggle}
        variant="ghost"
        size="icon"
        className={`fixed top-3 z-[100] bg-card border border-border shadow-md hover:bg-muted hover:shadow-lg transition-all ${
          isSidebarOpen ? 'left-[268px]' : 'left-3'
        }`}
        title={isSidebarOpen ? 'Menüyü Gizle' : 'Menüyü Göster'}
        aria-label={isSidebarOpen ? 'Menüyü Gizle' : 'Menüyü Göster'}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-card border-r border-border h-screen flex flex-col shadow-lg ${isSidebarOpen ? 'overflow-visible' : 'overflow-hidden'}`}>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">AI Trader</h1>
          <p className="text-sm text-muted-foreground mt-1">Algoritmik Trading Platformu</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Ana navigasyon">
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
    debugLog('SIDEBAR_CLICK', `Navigation clicked: ${item.id} -> ${item.label}`)
    onClick(item.id)
  }, [item.id, item.label, onClick])
  
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