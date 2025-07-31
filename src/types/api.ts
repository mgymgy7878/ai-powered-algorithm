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
  binance: {
    apiKey: string
    secretKey: string
    testnet: boolean
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

export interface BinanceMarketData {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  high24h: number
  low24h: number
  timestamp: number
}

export interface BinanceKlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  numberOfTrades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
}

export interface BinanceAccountInfo {
  balances: Array<{
    asset: string
    free: string
    locked: string
  }>
  totalWalletBalance: string
  totalUnrealizedProfit: string
  totalMarginBalance: string
  totalPositionInitialMargin: string
}