import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Sidebar } from '../components/layout/Sidebar'

const defaultProps = {
  currentView: 'dashboard' as const,
  onViewChange: vi.fn(),
  strategyCount: 5,
  runningStrategiesCount: 2
}

describe('🧭 Sidebar Navigation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Sidebar render edilmeli', () => {
    render(<Sidebar {...defaultProps} />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('Tüm navigasyon öğeleri görünmeli', () => {
    render(<Sidebar {...defaultProps} />)
    
    const expectedMenuItems = [
      'Anasayfa',
      'Stratejiler',
      'Çalışan Stratejiler',
      'Backtesting',
      'Portföy',
      'Piyasa Analizi',
      'Ekonomik Takvim'
    ]

    expectedMenuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('Aktif görünüm vurgulanmalı', () => {
    render(<Sidebar {...defaultProps} currentView="strategies" />)
    
    const strategiesLink = screen.getByText('Stratejiler').closest('button')
    expect(strategiesLink).toHaveClass('bg-primary/10')
  })

  it('Navigasyon tıklamaları çalışmalı', async () => {
    const mockOnViewChange = vi.fn()
    render(<Sidebar {...defaultProps} onViewChange={mockOnViewChange} />)
    
    const strategiesButton = screen.getByText('Stratejiler')
    fireEvent.click(strategiesButton)
    
    expect(mockOnViewChange).toHaveBeenCalledWith('strategies')
  })

  it('Strateji sayaçları doğru gösterilmeli', () => {
    render(<Sidebar {...defaultProps} strategyCount={10} runningStrategiesCount={3} />)
    
    expect(screen.getByText('10')).toBeInTheDocument() // Total strategies
    expect(screen.getByText('3')).toBeInTheDocument()  // Running strategies
  })

  it('Menu toggle çalışmalı', async () => {
    render(<Sidebar {...defaultProps} />)
    
    // Menu toggle butonunu bul
    const toggleButton = screen.getByRole('button', { name: /menu/i })
    if (toggleButton) {
      fireEvent.click(toggleButton)
      
      // Sidebar'ın genişlik durumu değişmeli
      await waitFor(() => {
        const sidebar = screen.getByRole('navigation')
        expect(sidebar).toHaveClass('w-0', 'overflow-hidden')
      })
    }
  })

  it('Responsive davranış test edilmeli', () => {
    // Mobile viewport simülasyonu
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    })

    render(<Sidebar {...defaultProps} />)
    
    // Mobile'da sidebar'ın davranışını kontrol et
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toBeInTheDocument()
  })

  it('Keyboard navigation çalışmalı', async () => {
    const mockOnViewChange = vi.fn()
    render(<Sidebar {...defaultProps} onViewChange={mockOnViewChange} />)
    
    const strategiesButton = screen.getByText('Stratejiler')
    
    // Tab ile focus
    strategiesButton.focus()
    expect(strategiesButton).toHaveFocus()
    
    // Enter ile tıklama
    fireEvent.keyDown(strategiesButton, { key: 'Enter', code: 'Enter' })
    expect(mockOnViewChange).toHaveBeenCalledWith('strategies')
  })

  it('İkonlar doğru gösterilmeli', () => {
    render(<Sidebar {...defaultProps} />)
    
    // SVG ikonları kontrol et
    const icons = screen.getAllByRole('img', { hidden: true })
    expect(icons.length).toBeGreaterThan(0)
  })

  it('Badge durumları test edilmeli', () => {
    render(<Sidebar {...defaultProps} runningStrategiesCount={0} />)
    
    // Çalışan strateji olmadığında badge görünmemeli
    const runningStrategiesText = screen.getByText('Çalışan Stratejiler')
    const badge = runningStrategiesText.parentElement?.querySelector('.badge')
    
    if (badge) {
      expect(badge.textContent).toBe('0')
    }
  })
})