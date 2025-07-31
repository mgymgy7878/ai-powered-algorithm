export interface Indicator {
  name: string
  type: 'technical' | 'volume' | 'momentum' | 'volatility'
  parameters: Record<string, number>
  enabled: boolean
}

export interface TradingStrategy {
  id: string
  name: string
  description: string
  code: string
  language?: 'csharp' | 'python'
  category?: 'scalping' | 'grid' | 'trend' | 'breakout' | 'mean_reversion' | 'custom'
  indicators: Indicator[]
  parameters: Record<string, number>
  status: 'draft' | 'generating' | 'testing' | 'optimizing' | 'ready' | 'live' | 'paused' | 'error'
  createdAt: string
  lastModified: string
  errors?: string[]
  performance?: {
    winRate: number
    totalReturn: number
    sharpeRatio: number
    maxDrawdown: number
    totalTrades: number
    avgTradeDuration: number
    profitFactor: number
    calmarRatio: number
    monthlyReturns?: number[]
    riskMetrics?: {
      volatility: number
      beta: number
      alpha: number
      var95: number
    }
  }
  optimization?: {
    bestParameters: Record<string, number>
    iterations: number
    score: number
    history: Array<{
      parameters: Record<string, number>
      score: number
      metrics: any
    }>
  }
  aiAnalysis?: {
    marketConditions: string[]
    riskLevel: 'low' | 'medium' | 'high'
    suitability: string
    suggestions: string[]
    confidence: number
    complexity: 'simple' | 'moderate' | 'complex'
    timeframe: string[]
    assets: string[]
  }
  matrixScore?: {
    overall: number
    profitability: number
    stability: number
    robustness: number
    efficiency: number
    grade?: string
  }
  liveStats?: {
    isRunning: boolean
    startDate: string
    currentPnL: number
    activePositions: number
    todayTrades: number
  }
}