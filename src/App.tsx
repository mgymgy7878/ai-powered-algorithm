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
import { APISettings } from './components/settings/APISettings'
import { Toaster } from './components/ui/sonner'
import { aiService } from './services/aiService'
import { binanceService } from './services/binanceService'
import { APISettings as APISettingsType } from './types/api'

export type AppView = 'dashboard' | 'strategies' | 'backtest' | 'live' | 'portfolio' | 'analysis' | 'settings'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [strategies] = useKV('trading-strategies', [])
  const [liveStrategies] = useKV('live-strategies', [])
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
        if (apiSettings.binance?.enabled && apiSettings.binance?.apiKey && apiSettings.binance?.secretKey) {
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
      case 'settings':
        return <APISettings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          strategyCount={strategies.length}
          runningStrategiesCount={liveStrategies.length}
        />
        <main className="flex-1 overflow-hidden">
          {renderView()}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App