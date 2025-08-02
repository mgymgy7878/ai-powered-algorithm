import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TradingAssistant } from '../components/ai/TradingAssistant'

// Mock AI service
vi.mock('../services/aiService', () => ({
  aiService: {
    sendMessage: vi.fn().mockResolvedValue('Mocked AI response'),
    setSettings: vi.fn(),
    isConfigured: vi.fn().mockReturnValue(true)
  }
}))

describe('🤖 AI Trading Assistant Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('AI Assistant render edilmeli', () => {
    render(<TradingAssistant />)
    
    expect(screen.getByText(/AI Trading Yöneticisi/i)).toBeInTheDocument()
  })

  it('Mesaj gönderme işlevi çalışmalı', async () => {
    render(<TradingAssistant />)
    
    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /gönder/i })
    
    fireEvent.change(input, { target: { value: 'Test mesajı' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Test mesajı')).toBeInTheDocument()
    })
  })

  it('AI yanıtları görüntülenmeli', async () => {
    const mockAiService = await import('../services/aiService')
    mockAiService.aiService.sendMessage.mockResolvedValue('AI yanıtı test')
    
    render(<TradingAssistant />)
    
    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /gönder/i })
    
    fireEvent.change(input, { target: { value: 'Portföyümü analiz et' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('AI yanıtı test')).toBeInTheDocument()
    })
  })

  it('Hızlı komutlar çalışmalı', async () => {
    render(<TradingAssistant />)
    
    // Hızlı komut butonlarını bul ve test et
    const quickCommandButtons = screen.getAllByRole('button')
    const portfolioCommand = quickCommandButtons.find(btn => 
      btn.textContent?.includes('portföy')
    )
    
    if (portfolioCommand) {
      fireEvent.click(portfolioCommand)
      
      await waitFor(() => {
        expect(screen.getByDisplayValue(/portföy/i)).toBeInTheDocument()
      })
    }
  })

  it('Loading durumu gösterilmeli', async () => {
    const mockAiService = await import('../services/aiService')
    mockAiService.aiService.sendMessage.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve('Delayed response'), 1000))
    )
    
    render(<TradingAssistant />)
    
    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /gönder/i })
    
    fireEvent.change(input, { target: { value: 'Test' } })
    fireEvent.click(sendButton)
    
    // Loading spinner kontrolü
    expect(screen.getByRole('button', { name: /gönder/i })).toBeDisabled()
  })

  it('Hata durumları yakalanmalı', async () => {
    const mockAiService = await import('../services/aiService')
    mockAiService.aiService.sendMessage.mockRejectedValue(new Error('API Error'))
    
    render(<TradingAssistant />)
    
    const input = screen.getByRole('textbox')
    const sendButton = screen.getByRole('button', { name: /gönder/i })
    
    fireEvent.change(input, { target: { value: 'Test' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/hata/i)).toBeInTheDocument()
    })
  })

  it('API ayarları modal açılmalı', async () => {
    render(<TradingAssistant />)
    
    const settingsButton = screen.getByRole('button', { name: /ayar/i })
    fireEvent.click(settingsButton)
    
    await waitFor(() => {
      expect(screen.getByText(/API Ayarları/i)).toBeInTheDocument()
    })
  })

  it('Model seçimi çalışmalı', async () => {
    render(<TradingAssistant />)
    
    const modelSelect = screen.getByRole('combobox')
    fireEvent.click(modelSelect)
    
    await waitFor(() => {
      expect(screen.getByText(/GPT-4o/i)).toBeInTheDocument()
      expect(screen.getByText(/Claude/i)).toBeInTheDocument()
    })
  })
})