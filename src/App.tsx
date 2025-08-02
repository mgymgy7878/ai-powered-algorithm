import { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import { useKV } from '@github/spark/hooks'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { Toaster } from './components/ui/sonner'
import { ActivityProvider } from './contexts/ActivityContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { aiService } from './services/aiService'
import { binanceService } from './services/binanceService'
import { APISettings as APISettingsType } from './types/api'
import { useNavigationPerformance } from './hooks/useNavigationPerformance'
import { debugLog, safePushNotification, waitForFunction, initDebugMode } from './utils/debugUtils'

// Lazy load components for better performance
const StrategiesPage = lazy(() => import('./components/strategy/StrategiesPage').then(m => ({ default: m.StrategiesPage })))
const BacktestEngine = lazy(() => import('./components/backtest/BacktestEngine').then(m => ({ default: m.BacktestEngine })))
const LiveTrading = lazy(() => import('./components/live/LiveTrading').then(m => ({ default: m.LiveTrading })))
const PortfolioView = lazy(() => import('./components/portfolio/PortfolioView').then(m => ({ default: m.PortfolioView })))
const MarketAnalysis = lazy(() => import('./components/analysis/MarketAnalysis').then(m => ({ default: m.MarketAnalysis })))
const EconomicCalendar = lazy(() => import('./components/economic/EconomicCalendar').then(m => ({ default: m.EconomicCalendar })))
const APISettings = lazy(() => import('./components/settings/APISettings').then(m => ({ default: m.APISettings })))
const ProjectAnalysis = lazy(() => import('./pages/ProjectAnalysis'))

export type AppView = 'dashboard' | 'strategies' | 'backtest' | 'live' | 'portfolio' | 'analysis' | 'economic' | 'settings' | 'project-analysis'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  
  // Initialize debug mode
  useEffect(() => {
    initDebugMode()
    debugLog('APP_INIT', 'App component initialized')
  }, [])
  
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
    debugLog('VIEW_CHANGE', `${currentView} -> ${newView}`)
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

    // Wait for pushNotification to be available, then send demo notifications
    const initNotifications = async () => {
      debugLog('NOTIFICATION_INIT', 'Waiting for pushNotification function...')
      
      const isAvailable = await waitForFunction('pushNotification', 10000)
      
      if (isAvailable) {
        debugLog('NOTIFICATION_INIT', 'pushNotification is available, sending demo notifications')
        
        // Initial notification
        setTimeout(() => {
          safePushNotification('🚀 AI Trading Platformu aktif! Tüm sistemler çalışıyor.', 'success')
        }, 1000)
        
        // Subsequent notifications
        setTimeout(() => {
          safePushNotification('📊 BTCUSDT için güçlü alım sinyali tespit edildi.', 'info')
        }, 8000)
        
        setTimeout(() => {
          safePushNotification('⚠️ Yüksek volatilite bekleniyor - pozisyonları gözden geçirin.', 'warning')
        }, 15000)
      } else {
        debugLog('NOTIFICATION_INIT', 'pushNotification function not available after waiting')
      }
    }
    
    initNotifications()

    // Listen for navigation events from components
    const handleNavigateToSettings = () => {
      setCurrentView('settings')
    }

    window.addEventListener('navigate-to-settings', handleNavigateToSettings)
    
    return () => {
      window.removeEventListener('navigate-to-settings', handleNavigateToSettings)
    }
  }, [apiSettings])

  const renderView = () => {
    debugLog('RENDER_VIEW', `Rendering view: ${currentView}`)
    
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
      default:
        return <Dashboard />
    }
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}

export default App