import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Sidebar } from './components/layout/Sidebar'
import { SimpleDashboard } from './components/dashboard/SimpleDashboard'
import { Toaster } from './components/ui/sonner'
import { ActivityProvider } from './contexts/ActivityContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { aiService } from './services/aiService'
import { binanceService } from './services/binanceService'
import { APISettings as APISettingsType } from './types/api'
import { useNavigationPerformance } from './hooks/useNavigationPerformance'
import { debugLog, safePushNotification, waitForFunction, initDebugMode } from './utils/debugUtils'

// Direct imports to avoid loading issues
import { StrategiesPage } from './components/strategy/StrategiesPage'
import { BacktestEngine } from './components/backtest/BacktestEngine'
import { LiveTrading } from './components/live/LiveTrading'
import { PortfolioView } from './components/portfolio/PortfolioView'
import { MarketAnalysis } from './components/analysis/MarketAnalysis'
import { EconomicCalendar } from './components/economic/EconomicCalendar'
import APISettings from './components/settings/APISettings'
import ProjectStatusPage from './pages/Summary'
import SimpleTestPage from './pages/SimpleTestPage'
import Proje from './pages/Proje'
import A from './pages/A'
import DebugPage from './pages/DebugPage'
import TestDisplay from './pages/TestDisplay'


export type AppView = 'dashboard' | 'strategies' | 'backtest' | 'live' | 'portfolio' | 'analysis' | 'economic' | 'settings' | 'project-status' | 'test' | 'proje' | 'a' | 'debug' | 'test-display'

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

    switch (currentView) {
      case 'dashboard':
        return <SimpleDashboard />
      case 'strategies':
        return <StrategiesPage />
      case 'backtest':
        return <BacktestEngine />
      case 'live':
        return <LiveTrading />
      case 'portfolio':
        return <PortfolioView />
      case 'analysis':
        return <MarketAnalysis />
      case 'economic':
        return <EconomicCalendar />
      case 'settings':
        return <APISettings />
      case 'project-status':
        return <ProjectStatusPage />
      case 'test':
        return <SimpleTestPage />
      case 'proje':
        return <Proje />
      case 'a':
        return <A />
      case 'debug':
        return <DebugPage />
      case 'test-display':
        return <TestDisplay />
      default:
        return <SimpleDashboard />
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