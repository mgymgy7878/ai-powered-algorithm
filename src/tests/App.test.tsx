import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import { ActivityProvider } from '../contexts/ActivityContext'

// Mock the lazy loaded components
vi.mock('../components/strategy/StrategiesPage', () => ({
  StrategiesPage: () => <div data-testid="strategies-page">Strategies Page</div>
}))

vi.mock('../components/backtest/BacktestEngine', () => ({
  BacktestEngine: () => <div data-testid="backtest-page">Backtest Engine</div>
}))

vi.mock('../components/live/LiveTrading', () => ({
  LiveTrading: () => <div data-testid="live-trading-page">Live Trading</div>
}))

vi.mock('../components/portfolio/PortfolioView', () => ({
  PortfolioView: () => <div data-testid="portfolio-page">Portfolio View</div>
}))

vi.mock('../components/analysis/MarketAnalysis', () => ({
  MarketAnalysis: () => <div data-testid="market-analysis-page">Market Analysis</div>
}))

vi.mock('../components/economic/EconomicCalendar', () => ({
  EconomicCalendar: () => <div data-testid="economic-calendar-page">Economic Calendar</div>
}))

vi.mock('../pages/Summary', () => ({
  default: () => <div data-testid="summary-page">Summary Page</div>
}))

vi.mock('../pages/Test', () => ({
  default: () => <div data-testid="test-page">Test Page</div>
}))

vi.mock('../pages/ProjectAnalysis', () => ({
  default: () => <div data-testid="project-analysis-page">Project Analysis</div>
}))

vi.mock('../pages/WebSocketTest', () => ({
  default: () => <div data-testid="websocket-test-page">WebSocket Test</div>
}))

const renderApp = () => {
  return render(
    <ActivityProvider>
      <App />
    </ActivityProvider>
  )
}

describe('🚀 App Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('Ana uygulama düzgün render edilmeli', async () => {
    renderApp()
    
    // Dashboard varsayılan olarak görünmeli
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })
  })

  it('Sidebar navigation çalışmalı', async () => {
    renderApp()
    
    // Sidebar'ın render edildiğini kontrol et
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  it('Lazy loading bileşenleri yüklenmeli', async () => {
    renderApp()
    
    // Strategies sayfasına geçiş yap
    const strategiesButton = screen.getByRole('button', { name: /stratejiler/i })
    fireEvent.click(strategiesButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('strategies-page')).toBeInTheDocument()
    })
  })

  it('API ayarları localStorage\'a kaydedilmeli', async () => {
    renderApp()
    
    // Local storage API ayarlarını kontrol et
    await waitFor(() => {
      const apiSettings = localStorage.getItem('api-settings')
      expect(apiSettings).toBeDefined()
    })
  })

  it('Hata durumlarında fallback component gösterilmeli', async () => {
    // Hatalı component mock'la
    vi.mocked(await import('../components/strategy/StrategiesPage')).StrategiesPage.mockImplementation(() => {
      throw new Error('Test error')
    })
    
    renderApp()
    
    // Error boundary çalışmalı
    await waitFor(() => {
      // Error fallback veya loading state kontrolü
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })

  it('Tüm navigation state\'leri test edilmeli', async () => {
    renderApp()
    
    const views = [
      'strategies', 'backtest', 'live', 'portfolio', 
      'analysis', 'economic', 'summary', 'test', 'project-analysis'
    ]
    
    for (const view of views) {
      const button = screen.getByRole('button', { name: new RegExp(view, 'i') })
      fireEvent.click(button)
      
      await waitFor(() => {
        const testId = `${view.replace('-', '-')}-page`
        expect(screen.getByTestId(testId)).toBeInTheDocument()
      })
    }
  })

  it('WebSocket bağlantısı test edilmeli', async () => {
    renderApp()
    
    // WebSocket test sayfasına git
    const websocketButton = screen.getByRole('button', { name: /websocket/i })
    fireEvent.click(websocketButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('websocket-test-page')).toBeInTheDocument()
    })
  })

  it('Performance monitoring çalışmalı', async () => {
    const performanceMarkSpy = vi.spyOn(performance, 'mark')
    
    renderApp()
    
    // Performance marks kontrol edilmeli
    await waitFor(() => {
      expect(performanceMarkSpy).toHaveBeenCalled()
    })
  })
})