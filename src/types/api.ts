export interface APISettings {
  openai: {
    apiKey: string
    model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
    enabled: boolean
  }
  anthropic: {
    apiKey: string
    model: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'
    enabled: boolean
  }
}

export interface AIProvider {
  name: 'openai' | 'anthropic'
  displayName: string
  models: string[]
  enabled: boolean
  configured: boolean
}

export interface AIRequest {
  provider: 'openai' | 'anthropic'
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  temperature?: number
  maxTokens?: number
}

export interface AIResponse {
  content: string
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  model: string
  provider: 'openai' | 'anthropic'
}