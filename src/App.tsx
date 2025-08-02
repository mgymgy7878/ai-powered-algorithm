import { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import { useKV } from '@github/spark/hooks'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { Toaster } from './components/ui/sonner'
import { ActivityProvider } from './contexts/ActivityContext'
import { aiService } from './services/aiService'
import { binanceService } from './services/binanceService'
import { APISettings as APISettingsType } from './types/api'
import { useNavigationPerformance } from './hooks/useNavigationPerformance'

// Lazy load components for better performance
const StrategiesPage = lazy(() => import('./components/strategy/StrategiesPage').then(m => ({ default: m.StrategiesPage })))
const BacktestEngine = lazy(() => import('./components/backtest/BacktestEngine').then(m => ({ default: m.BacktestEngine })))
const LiveTrading = lazy(() => import('./components/live/LiveTrading').then(m => ({ default: m.LiveTrading })))
const PortfolioView = lazy(() => import('./components/portfolio/PortfolioView').then(m => ({ default: m.PortfolioView })))
const MarketAnalysis = lazy(() => import('./components/analysis/MarketAnalysis').then(m => ({ default: m.MarketAnalysis })))
const EconomicCalendar = lazy(() => import('./components/economic/EconomicCalendar').then(m => ({ default: m.EconomicCalendar })))
const APISettings = lazy(() => import('./components/settings/APISettings').then(m => ({ default: m.APISettings })))
const ProjectAnalysis = lazy(() => import('./pages/ProjectAnalysis'))
const Summary = lazy(() => import('./pages/Summary'))
const Test = lazy(() => import('./pages/Test'))
const WebSocketTest = lazy(() => import('./pages/WebSocketTest'))

export type AppView = 'dashboard' | 'strategies' | 'backtest' | 'live' | 'portfolio' | 'analysis' | 'economic' | 'summary' | 'settings' | 'project-analysis' | 'test' | 'websocket-test'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  
  // Performance monitoring
  useNavigationPerformance(currentView)
  
  const [strategies] = useKV<any[]>('trading-strategies', [])
  const [liveStrategies] = useKV<any[]>('live-strategies', [])
  const [apiSettings] = useKV<APISettingsType>('api-settings', {
    openai: {
      apiKey: '',
      model: 'gpt-4',
      enabled: true
    },
    anthropic: {
      apiKey: '',
      model: 'claude-3-sonnet',
      enabled: false
    },
    binance: {
      apiKey: '',
      secretKey: '',
      testnet: true,
      enabled: false
    }
  })

  // Optimized view change handler
  const handleViewChange = useCallback((newView: AppView) => {
    console.log(`🔄 View change: ${currentView} -> ${newView}`)
    if (currentView !== newView) {
      setCurrentView(newView)
    }
  }, [currentView])

  // Initialize AI service with stored settings
  useEffect(() => {
    if (apiSettings) {
      try {
        aiService.setSettings(apiSettings)
        
        // Initialize Binance service if configured
        if (apiSettings.binance?.enabled === true && 
            apiSettings.binance?.apiKey?.trim() && 
            apiSettings.binance?.secretKey?.trim()) {
          binanceService.setCredentials(
            apiSettings.binance.apiKey,
            apiSettings.binance.secretKey,
            apiSettings.binance.testnet ?? true
          )
        }
      } catch (error) {
        console.error('API settings initialization error:', error)
      }
    }

    // Demo bildirimler için test fonksiyonu - 3 saniye sonra başlat
    const notificationTimer = setTimeout(() => {
      if ((window as any).pushNotification) {
        ;(window as any).pushNotification('🚀 AI Trading Platformu aktif! Tüm sistemler çalışıyor.', 'success')
        
        // İkinci bildirim 10 saniye sonra
        setTimeout(() => {
          ;(window as any).pushNotification('📊 BTCUSDT için güçlü alım sinyali tespit edildi.', 'info')
        }, 10000)
        
        // Üçüncü bildirim 20 saniye sonra
        setTimeout(() => {
          ;(window as any).pushNotification('⚠️ Yüksek volatilite bekleniyor - pozisyonları gözden geçirin.', 'warning')
        }, 20000)
      }
    }, 3000)

    // Listen for navigation events from components
    const handleNavigateToSettings = () => {
      setCurrentView('settings')
    }

    window.addEventListener('navigate-to-settings', handleNavigateToSettings)
    
    return () => {
      clearTimeout(notificationTimer)
      window.removeEventListener('navigate-to-settings', handleNavigateToSettings)
    }
  }, [apiSettings])

  const renderView = () => {
    console.log(`🎯 Rendering view: ${currentView}`)
    
    const LoadingFallback = () => (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'strategies':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <StrategiesPage />
          </Suspense>
        )
      case 'backtest':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <BacktestEngine />
          </Suspense>
        )
      case 'live':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LiveTrading />
          </Suspense>
        )
      case 'portfolio':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PortfolioView />
          </Suspense>
        )
      case 'analysis':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MarketAnalysis />
          </Suspense>
        )
      case 'economic':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <EconomicCalendar />
          </Suspense>
        )
      case 'summary':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Summary />
          </Suspense>
        )
      case 'settings':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <APISettings />
          </Suspense>
        )
      case 'project-analysis':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ProjectAnalysis />
          </Suspense>
        )
      case 'test':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Test />
          </Suspense>
        )
      case 'websocket-test':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <WebSocketTest />
          </Suspense>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <ActivityProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex">
          <Sidebar 
            currentView={currentView} 
            onViewChange={handleViewChange}
            strategyCount={strategies?.length ?? 0}
            runningStrategiesCount={liveStrategies?.length ?? 0}
          />
          <main className="flex-1 overflow-hidden">
            {renderView()}
          </main>
        </div>
        <Toaster />
      </div>
    </ActivityProvider>
  )
}

export default App