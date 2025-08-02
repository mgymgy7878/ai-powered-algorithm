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
import { Button } from './components/ui/button'

export type AppView = 'dashboard' | 'strategies' | 'backtest' | 'live' | 'portfolio' | 'analysis' | 'economic' | 'summary' | 'settings' | 'project-analysis' | 'test'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  
  // Debug için currentView değişikliklerini izle
  useEffect(() => {
    console.log('🎯🎯🎯 APP.TSX - currentView changed to:', currentView)
    console.log('🎯🎯🎯 APP.TSX - timestamp:', new Date().toLocaleTimeString())
  }, [currentView])
  
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
    console.log('🎬🎬🎬 RENDER VIEW FUNCTION CALLED')
    console.log('🎬🎬🎬 Current view in renderView:', currentView)
    console.log('🎬🎬🎬 Timestamp:', new Date().toLocaleTimeString())
    console.log('🎪 Available pages: dashboard, strategies, backtest, live, portfolio, analysis, economic, summary, settings, project-analysis, test')
    console.log('🔍 Checking imports - Test:', typeof Test)
    console.log('🔍 Checking imports - Summary:', typeof Summary)
    console.log('🔍 Checking imports - ProjectAnalysis:', typeof ProjectAnalysis)
    
    try {
      switch (currentView) {
        case 'dashboard':
          console.log('🏠 Rendering Dashboard')
          return <Dashboard />
        case 'strategies':
          console.log('⚙️ Rendering StrategiesPage')
          return <StrategiesPage />
        case 'backtest':
          console.log('📊 Rendering BacktestEngine')
          return <BacktestEngine />
        case 'live':
          console.log('🚀 Rendering LiveTrading')
          return <LiveTrading />
        case 'portfolio':
          console.log('💼 Rendering PortfolioView')
          return <PortfolioView />
        case 'analysis':
          console.log('🔍 Rendering MarketAnalysis')
          return <MarketAnalysis />
        case 'economic':
          console.log('📅 Rendering EconomicCalendar')
          return <EconomicCalendar />
        case 'summary':
          console.log('📊📊📊 Rendering Summary page - Component type:', typeof Summary)
          return <Summary />
        case 'settings':
          console.log('⚙️ Rendering APISettings page')
          return <APISettings />
        case 'project-analysis':
          console.log('📋📋📋 Rendering ProjectAnalysis page - Component type:', typeof ProjectAnalysis)
          return <ProjectAnalysis />
        case 'test':
          console.log('🧪🧪🧪 Rendering Test page - Component type:', typeof Test)
          return <Test />
        default:
          console.log('🏠 Rendering default Dashboard - Unknown view:', currentView)
          return <Dashboard />
      }
    } catch (error) {
      console.error('❌❌❌ Error rendering view:', currentView, error)
      console.error('❌❌❌ Error stack:', error.stack)
      return <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Sayfa Yükleme Hatası</h1>
        <p className="text-muted-foreground">Sayfa "{currentView}" yüklenirken hata oluştu: {String(error)}</p>
        <pre className="mt-4 p-4 bg-muted rounded text-xs">{error.stack}</pre>
      </div>
    }
  }

  return (
    <ActivityProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Debug Test Butonları - Geçici */}
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[200] flex gap-2 bg-red-500 p-2 rounded">
          <Button size="sm" onClick={() => {
            console.log('🧪 Debug buton - Test tıklandı')
            setCurrentView('test')
            console.log('🧪 Debug buton - Test view set edildi')
          }} className="bg-green-600 hover:bg-green-700 text-white text-xs">
            🧪 Test Sayfası
          </Button>
          <Button size="sm" onClick={() => {
            console.log('📊 Debug buton - Summary tıklandı')
            setCurrentView('summary')
            console.log('📊 Debug buton - Summary view set edildi')
          }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
            📊 Özet Sayfası  
          </Button>
          <Button size="sm" onClick={() => {
            console.log('📋 Debug buton - Project analysis tıklandı')
            setCurrentView('project-analysis')
            console.log('📋 Debug buton - Project analysis view set edildi')
          }} className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
            📋 Proje Durumu
          </Button>
          <span className="text-white text-xs flex items-center">Aktif: {currentView}</span>
        </div>
        
        <div className="flex">
          <Sidebar 
            currentView={currentView} 
            onViewChange={(newView) => {
              console.log('🔄🔄🔄 SIDEBAR CALLBACK - Old view:', currentView)
              console.log('🔄🔄🔄 SIDEBAR CALLBACK - New view:', newView)
              console.log('🔄🔄🔄 SIDEBAR CALLBACK - Calling setCurrentView')
              setCurrentView(newView)
              console.log('🔄🔄🔄 SIDEBAR CALLBACK - setCurrentView called')
            }}
            strategyCount={strategies?.length ?? 0}
            runningStrategiesCount={liveStrategies?.length ?? 0}
          />
          <main className="flex-1 overflow-hidden">
            {(() => {
              console.log('🎭🎭🎭 MAIN RENDER - About to call renderView()')
              const result = renderView()
              console.log('🎭🎭🎭 MAIN RENDER - renderView() completed')
              return result
            })()}
          </main>
        </div>
        <Toaster />
      </div>
    </ActivityProvider>
  )
}

export default App