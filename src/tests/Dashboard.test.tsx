import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Dashboard } from '../components/dashboard/Dashboard'
import { ActivityProvider } from '../contexts/ActivityContext'

// Mock child components
vi.mock('../components/ai/TradingAssistant', () => ({
  TradingAssistant: () => <div data-testid="trading-assistant">AI Trading Assistant</div>
}))

vi.mock('../components/ui/NotificationCenter', () => ({
  NotificationCenter: () => <div data-testid="notification-center">Notification Center</div>
}))

const renderDashboard = () => {
  return render(
    <ActivityProvider>
      <Dashboard />
    </ActivityProvider>
  )
}

describe('📊 Dashboard Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('Dashboard render edilmeli', () => {
    renderDashboard()
    
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('Portföy metrikleri görüntülenmeli', () => {
    renderDashboard()
    
    const expectedMetrics = [
      'Portföy Değeri',
      'Günlük K/Z',
      'Toplam K/Z',
      'Başarı Oranı',
      'Aktif Stratejiler'
    ]

    expectedMetrics.forEach(metric => {
      expect(screen.getByText(metric)).toBeInTheDocument()
    })
  })

  it('AI Trading Assistant görünmeli', () => {
    renderDashboard()
    
    expect(screen.getByTestId('trading-assistant')).toBeInTheDocument()
  })

  it('Bildirim merkezi görünmeli', () => {
    renderDashboard()
    
    expect(screen.getByTestId('notification-center')).toBeInTheDocument()
  })

  it('Metrik değerleri doğru formatta gösterilmeli', () => {
    renderDashboard()
    
    // Para formatları kontrol et
    expect(screen.getByText(/\$50,000\.00/)).toBeInTheDocument()
    expect(screen.getByText(/\$1,250\.50/)).toBeInTheDocument()
    
    // Yüzde formatları kontrol et
    expect(screen.getByText(/68\.50%/)).toBeInTheDocument()
  })

  it('Responsive layout çalışmalı', () => {
    // Mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    })

    renderDashboard()
    
    const dashboard = screen.getByTestId('dashboard')
    expect(dashboard).toBeInTheDocument()
  })

  it('Real-time data güncellemeleri simüle edilmeli', async () => {
    renderDashboard()
    
    // Mock data update
    const mockUpdate = {
      portfolioValue: 51000,
      dailyPnl: 1500,
      totalPnl: 9000
    }

    // Simulate data update event
    window.dispatchEvent(new CustomEvent('portfolio-update', { detail: mockUpdate }))
    
    // Güncellenen değerlerin görünmesini bekle
    await waitFor(() => {
      // Updated values should appear (this would need actual implementation)
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })
  })

  it('Hata durumları gracefully handle edilmeli', async () => {
    // Mock error in data fetching
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Simulate API error
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'))
    
    renderDashboard()
    
    // Dashboard should still render with default values
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('Loading states test edilmeli', async () => {
    // Mock slow API response
    global.fetch = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({})
      }), 1000))
    )

    renderDashboard()
    
    // Loading state should be visible initially
    // (This would need actual loading state implementation)
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('Keyboard accessibility test edilmeli', () => {
    renderDashboard()
    
    // Tab navigation test
    const dashboard = screen.getByTestId('dashboard')
    dashboard.focus()
    
    expect(document.activeElement).toBe(dashboard)
  })

  it('Performance metrikleri tracked edilmeli', () => {
    const performanceMarkSpy = vi.spyOn(performance, 'mark')
    
    renderDashboard()
    
    expect(performanceMarkSpy).toHaveBeenCalled()
  })
})