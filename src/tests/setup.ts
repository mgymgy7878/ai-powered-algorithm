// Test setup configuration
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Mock window.spark API
global.spark = {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => {
    return strings.raw.join('') + values.join('')
  },
  llm: async (prompt: string, modelName?: string, jsonMode?: boolean) => {
    return Promise.resolve('Mocked AI response')
  },
  user: async () => {
    return Promise.resolve({
      avatarUrl: 'https://example.com/avatar.png',
      email: 'test@example.com',
      id: 'test-user-123',
      isOwner: true,
      login: 'testuser'
    })
  },
  kv: {
    keys: async () => Promise.resolve(['test-key']),
    get: async (key: string) => Promise.resolve(null),
    set: async (key: string, value: any) => Promise.resolve(),
    delete: async (key: string) => Promise.resolve()
  }
}

// Mock performance monitoring
global.performance = {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {}
} as any

// Mock WebSocket for real-time tests
global.WebSocket = class MockWebSocket {
  constructor(url: string) {
    this.url = url
    this.readyState = 1 // OPEN
  }
  
  url: string
  readyState: number
  onopen: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  
  send(data: string) {
    // Mock sending data
    console.log('Mock WebSocket send:', data)
  }
  
  close() {
    this.readyState = 3 // CLOSED
    if (this.onclose) {
      this.onclose(new CloseEvent('close'))
    }
  }
} as any

// Mock fetch for API calls
global.fetch = async (url: string | Request, init?: RequestInit) => {
  const urlString = typeof url === 'string' ? url : url.url
  
  // Mock different API responses
  if (urlString.includes('/api/binance')) {
    return new Response(JSON.stringify({
      symbol: 'BTCUSDT',
      price: '50000.00'
    }), { status: 200 })
  }
  
  if (urlString.includes('/api/openai')) {
    return new Response(JSON.stringify({
      choices: [{
        message: {
          content: 'Mocked OpenAI response'
        }
      }]
    }), { status: 200 })
  }
  
  return new Response('Not Found', { status: 404 })
}

beforeAll(() => {
  console.log('🧪 Test suite başlatılıyor...')
})

afterAll(() => {
  console.log('✅ Test suite tamamlandı')
})

beforeEach(() => {
  // Her testten önce localStorage temizle
  if (typeof localStorage !== 'undefined') {
    localStorage.clear()
  }
})

afterEach(() => {
  // Her testten sonra mock'ları temizle
  jest.clearAllMocks?.()
})