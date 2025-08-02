import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { StrategiesPage } from './components/strategy/StrategiesPage'
import { BacktestEngine } from './components/backtest/BacktestEngine'
import { LiveTrading } from './components/live/LiveTrading'
import { PortfolioView } from './components/portfolio/PortfolioView'
import { MarketAnalysis } from './components/analysis/MarketAnalysis'
import { TradingAssistant } from './components/ai/TradingAssistant'
import { EconomicCalendar } from './components/economic/EconomicCalendar'
import { APISettings } from './components/settings/APISettings'
import ProjectAnalysis from './pages/ProjectAnalysis'
import Summary from './pages/Summary'
import Test from './pages/Test'
import { Toaster } from './components/ui/sonner'
import { ActivityProvider } from './contexts/ActivityContext'
import { aiService } from './services/aiService'
import { binanceService } from './services/binanceService'
import { APISettings as APISettingsType } from './types/api'

export type AppView = 'dashboard' | 'strategies' | 'backtest' | 'live' | 'portfolio' | 'analysis' | 'economic' | 'summary' | 'settings' | 'project-analysis' | 'test'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
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
    setTimeout(() => {
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
      window.removeEventListener('navigate-to-settings', handleNavigateToSettings)
    }
  }, [apiSettings])

  const renderView = () => {
    console.log('Current view:', currentView) // Debug için
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
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
      case 'summary':
        return <Summary />
      case 'settings':
        return <APISettings />
      case 'project-analysis':
        return <ProjectAnalysis />
      case 'test':
        return <Test />
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
            onViewChange={setCurrentView}
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