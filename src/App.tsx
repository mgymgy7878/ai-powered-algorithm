import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { StrategyGenerator } from './components/strategy/StrategyGenerator'
import { BacktestEngine } from './components/backtest/BacktestEngine'
import { LiveTrading } from './components/live/LiveTrading'
import { PortfolioView } from './components/portfolio/PortfolioView'
import { MarketAnalysis } from './components/analysis/MarketAnalysis'
import { Toaster } from './components/ui/sonner'

export type AppView = 'dashboard' | 'strategies' | 'backtest' | 'live' | 'portfolio' | 'analysis'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [strategies] = useKV('trading-strategies', [])

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