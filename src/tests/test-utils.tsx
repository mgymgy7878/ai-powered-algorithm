// Test utilities and helpers
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ActivityProvider } from '../contexts/ActivityContext'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ActivityProvider>
      {children}
    </ActivityProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }

// Mock implementations for common APIs
export const mockSpark = {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => {
    return strings.raw.join('') + values.join('')
  },
  llm: jest.fn().mockResolvedValue('Mocked AI response'),
  user: jest.fn().mockResolvedValue({
    avatarUrl: 'https://example.com/avatar.png',
    email: 'test@example.com',
    id: 'test-user-123',
    isOwner: true,
    login: 'testuser'
  }),
  kv: {
    keys: jest.fn().mockResolvedValue(['test-key']),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined)
  }
}

// Mock fetch for API calls
export const mockFetch = (mockResponse: any, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(mockResponse),
    text: () => Promise.resolve(JSON.stringify(mockResponse))
  })
}

// Mock WebSocket
export class MockWebSocket {
  constructor(public url: string) {
    this.readyState = 1 // OPEN
  }
  
  readyState: number
  onopen: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  
  send = jest.fn()
  close = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
}

// Performance monitoring mock
export const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 10000000,
    jsHeapSizeLimit: 100000000
  }
}

// Async test helper
export const waitForAsync = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

// Component test helpers
export const getByTestId = (container: HTMLElement, testId: string) => {
  return container.querySelector(`[data-testid="${testId}"]`)
}

export const getAllByTestId = (container: HTMLElement, testId: string) => {
  return container.querySelectorAll(`[data-testid="${testId}"]`)
}