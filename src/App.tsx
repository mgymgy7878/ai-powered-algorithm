import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { StrategyGenerator } from './components/strategy/StrategyGenerator'
import { BacktestEngine } from './components/backtest/BacktestEngine'
import { LiveTrading } from './components/live/LiveTrading'
import { PortfolioView } from './components/portfolio/PortfolioView'
import { MarketAnalysis } from './components/analysis/MarketAnalysis'
import { APISettings } from './components/settings/APISettings'
import { Toaster } from './components/ui/sonner'
import { aiService } from './services/aiService'
import { binanceService } from './services/binanceService'
import { APISettings as APISettingsType } from './types/api'

export type AppView = 'dashboard' | 'strategies' | 'backtest' | 'live' | 'portfolio' | 'analysis' | 'settings'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [strategies] = useKV('trading-strategies', [])
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
    aiService.setSettings(apiSettings)
    
    // Initialize Binance service if configured
    if (apiSettings.binance.enabled && apiSettings.binance.apiKey && apiSettings.binance.secretKey) {
      binanceService.setCredentials(
        apiSettings.binance.apiKey,
        apiSettings.binance.secretKey,
        apiSettings.binance.testnet
      )
    }
  }, [apiSettings])

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'strategies':
        return <StrategyGenerator />
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