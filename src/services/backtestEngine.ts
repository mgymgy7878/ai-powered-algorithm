import { UTCTimestamp } from 'lightweight-charts'
import { TradeSignal } from '../components/charts/TradingChart'
import { CandlestickData } from 'lightweight-charts'

export interface BacktestConfiguration {
  strategyId: string
  symbol: string
  timeframe: string
  startDate: string
  endDate: string
  initialCapital: number
  feePercentage: number
  slippage: number
  barCount?: number // Belirli sayıda bar için test
  maxTrades?: number // Maksimum işlem sayısı
}

export interface BacktestTrade {
  id: string
  entryTime: UTCTimestamp
  exitTime: UTCTimestamp
  type: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  quantity: number
  profit: number
  profitPercentage: number
  fees: number
  commission: number
  duration: number // dakika cinsinden
}

export interface BacktestMetrics {
  totalReturn: number
  totalReturnPercentage: number
  winRate: number
  profitFactor: number
  sharpeRatio: number
  maxDrawdown: number
  maxDrawdownPercentage: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  averageWin: number
  averageLoss: number
  largestWin: number
  largestLoss: number
  averageTradeDuration: number
  maxConsecutiveWins: number
  maxConsecutiveLosses: number
  calmarRatio: number
  sortinoRatio: number
  recoveryFactor: number
}

export interface BacktestResult {
  id: string
  configuration: BacktestConfiguration
  metrics: BacktestMetrics
  trades: BacktestTrade[]
  signals: TradeSignal[]
  equity: Array<{ time: UTCTimestamp; value: number }>
  drawdown: Array<{ time: UTCTimestamp; value: number }>
  runDate: string
  duration: number // ms cinsinden test süresi
  status: 'completed' | 'failed' | 'running'
  error?: string
}

export interface OptimizationParameter {
  name: string
  type: 'number' | 'boolean' | 'string'
  min?: number
  max?: number
  step?: number
  values?: (string | number | boolean)[]
  current: string | number | boolean
}

export interface OptimizationConfiguration {
  strategyId: string
  parameters: OptimizationParameter[]
  targetMetric: keyof BacktestMetrics
  maximizeMetric: boolean // true: maksimize et, false: minimize et
  maxIterations: number
  symbol: string
  timeframe: string
  startDate: string
  endDate: string
  initialCapital: number
}

export interface OptimizationResult {
  id: string
  configuration: OptimizationConfiguration
  bestResult: BacktestResult
  allResults: BacktestResult[]
  bestParameters: Record<string, any>
  iterations: number
  completedIterations: number
  status: 'completed' | 'failed' | 'running' | 'paused'
  startTime: string
  endTime?: string
  duration?: number
}

class BacktestEngine {
  private runningBacktests = new Map<string, AbortController>()
  private runningOptimizations = new Map<string, AbortController>()

  async runBacktest(
    config: BacktestConfiguration,
    candlestickData: CandlestickData[],
    strategyCode: string
  ): Promise<BacktestResult> {
    // strategyCode parametresinin güvenli kontrolü
    if (!strategyCode) {
      throw new Error('Backtest için strateji kodu gereklidir')
    }
    
    const backtestId = Date.now().toString()
    const controller = new AbortController()
    this.runningBacktests.set(backtestId, controller)

    try {
      const startTime = Date.now()
      
      // Strateji kodunu çalıştırabilir hale getir (simülasyon)
      const strategy = this.parseStrategy(strategyCode)
      
      // Test verilerini filtrele
      const filteredData = this.filterDataByDateRange(
        candlestickData,
        config.startDate,
        config.endDate
      )

      if (config.barCount) {
        filteredData.splice(config.barCount)
      }

      // Backtest çalıştır
      const { trades, signals, equity, drawdown } = await this.executeBacktest(
        strategy,
        filteredData,
        config,
        controller.signal
      )

      // Metrikleri hesapla
      const metrics = this.calculateMetrics(trades, equity, config.initialCapital)

      const result: BacktestResult = {
        id: backtestId,
        configuration: config,
        metrics,
        trades,
        signals,
        equity,
        drawdown,
        runDate: new Date().toISOString(),
        duration: Date.now() - startTime,
        status: 'completed'
      }

      return result

    } catch (error) {
      console.error('Backtest error:', error)
      return {
        id: backtestId,
        configuration: config,
        metrics: this.getEmptyMetrics(),
        trades: [],
        signals: [],
        equity: [],
        drawdown: [],
        runDate: new Date().toISOString(),
        duration: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    } finally {
      this.runningBacktests.delete(backtestId)
    }
  }

  async runOptimization(
    config: OptimizationConfiguration,
    candlestickData: CandlestickData[],
    strategyCode: string,
    onProgress?: (progress: { completed: number; total: number; bestResult?: BacktestResult }) => void
  ): Promise<OptimizationResult> {
    // strategyCode parametresinin güvenli kontrolü
    if (!strategyCode) {
      throw new Error('Optimizasyon için strateji kodu gereklidir')
    }
    
    const optimizationId = Date.now().toString()
    const controller = new AbortController()
    this.runningOptimizations.set(optimizationId, controller)

    try {
      const startTime = new Date().toISOString()
      
      // Parametre kombinasyonlarını oluştur
      const parameterCombinations = this.generateParameterCombinations(config.parameters)
      const totalIterations = Math.min(parameterCombinations.length, config.maxIterations)
      
      let bestResult: BacktestResult | null = null
      const allResults: BacktestResult[] = []
      
      for (let i = 0; i < totalIterations; i++) {
        if (controller.signal.aborted) break

        const parameters = parameterCombinations[i]
        
        // Strateji koduna parametreleri uygula
        const modifiedStrategyCode = this.applyParametersToStrategy(strategyCode, parameters)
        
        // Backtest yapılandırması oluştur
        const backtestConfig: BacktestConfiguration = {
          strategyId: config.strategyId,
          symbol: config.symbol,
          timeframe: config.timeframe,
          startDate: config.startDate,
          endDate: config.endDate,
          initialCapital: config.initialCapital,
          feePercentage: 0.1, // %0.1 komisyon
          slippage: 0.05 // %0.05 slipaj
        }

        // Backtest çalıştır
        const result = await this.runBacktest(backtestConfig, candlestickData, modifiedStrategyCode)
        allResults.push(result)

        // En iyi sonucu kontrol et
        if (result.status === 'completed') {
          const currentMetricValue = result.metrics[config.targetMetric] as number
          const bestMetricValue = bestResult ? bestResult.metrics[config.targetMetric] as number : null

          if (!bestResult || 
              (config.maximizeMetric && currentMetricValue > bestMetricValue!) ||
              (!config.maximizeMetric && currentMetricValue < bestMetricValue!)) {
            bestResult = result
          }
        }

        // İlerleme bildir
        if (onProgress) {
          onProgress({
            completed: i + 1,
            total: totalIterations,
            bestResult: bestResult || undefined
          })
        }

        // Kısa bir bekleme (UI'nın yanıt verebilmesi için)
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      return {
        id: optimizationId,
        configuration: config,
        bestResult: bestResult!,
        allResults,
        bestParameters: bestResult ? this.extractParametersFromResult(bestResult) : {},
        iterations: totalIterations,
        completedIterations: allResults.length,
        status: 'completed',
        startTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - new Date(startTime).getTime()
      }

    } catch (error) {
      console.error('Optimization error:', error)
      throw error
    } finally {
      this.runningOptimizations.delete(optimizationId)
    }
  }

  stopBacktest(backtestId: string) {
    const controller = this.runningBacktests.get(backtestId)
    if (controller) {
      controller.abort()
      this.runningBacktests.delete(backtestId)
    }
  }

  stopOptimization(optimizationId: string) {
    const controller = this.runningOptimizations.get(optimizationId)
    if (controller) {
      controller.abort()
      this.runningOptimizations.delete(optimizationId)
    }
  }

  private parseStrategy(strategyCode: string): any {
    // Strateji kodunu parse et (basit simülasyon)
    return {
      onTick: () => Math.random() > 0.95 ? (Math.random() > 0.5 ? 'buy' : 'sell') : null
    }
  }

  private filterDataByDateRange(
    data: CandlestickData[],
    startDate: string,
    endDate: string
  ): CandlestickData[] {
    const start = new Date(startDate).getTime() / 1000
    const end = new Date(endDate).getTime() / 1000
    
    return data.filter(candle => candle.time >= start && candle.time <= end)
  }

  private async executeBacktest(
    strategy: any,
    data: CandlestickData[],
    config: BacktestConfiguration,
    signal: AbortSignal
  ): Promise<{
    trades: BacktestTrade[]
    signals: TradeSignal[]
    equity: Array<{ time: UTCTimestamp; value: number }>
    drawdown: Array<{ time: UTCTimestamp; value: number }>
  }> {
    const trades: BacktestTrade[] = []
    const signals: TradeSignal[] = []
    const equity: Array<{ time: UTCTimestamp; value: number }> = []
    const drawdown: Array<{ time: UTCTimestamp; value: number }> = []
    
    let balance = config.initialCapital
    let position: { type: 'long' | 'short'; entry: number; quantity: number; entryTime: UTCTimestamp } | null = null
    let maxEquity = balance
    let tradeId = 1

    for (let i = 0; i < data.length; i++) {
      if (signal.aborted) break

      const candle = data[i]
      const signal_type = strategy.onTick()

      // Al sinyali
      if (signal_type === 'buy' && !position) {
        const quantity = Math.floor(balance * 0.95 / candle.close) // %95'ini kullan
        if (quantity > 0) {
          position = {
            type: 'long',
            entry: candle.close,
            quantity,
            entryTime: candle.time
          }
          
          signals.push({
            time: candle.time,
            type: 'buy',
            price: candle.close,
            id: `buy_${tradeId}`
          })
        }
      }
      
      // Sat sinyali
      else if (signal_type === 'sell' && position && position.type === 'long') {
        const exitPrice = candle.close
        const profit = (exitPrice - position.entry) * position.quantity
        const fees = (position.entry * position.quantity + exitPrice * position.quantity) * config.feePercentage / 100
        const netProfit = profit - fees
        
        balance += netProfit
        
        trades.push({
          id: `trade_${tradeId}`,
          entryTime: position.entryTime,
          exitTime: candle.time,
          type: position.type,
          entryPrice: position.entry,
          exitPrice,
          quantity: position.quantity,
          profit: netProfit,
          profitPercentage: (netProfit / (position.entry * position.quantity)) * 100,
          fees,
          commission: fees,
          duration: (candle.time - position.entryTime) / 60 // dakika
        })

        signals.push({
          time: candle.time,
          type: 'sell',
          price: candle.close,
          id: `sell_${tradeId}`
        })
        
        position = null
        tradeId++
      }

      // Equity ve drawdown hesapla
      let currentEquity = balance
      if (position) {
        currentEquity += (candle.close - position.entry) * position.quantity
      }
      
      equity.push({ time: candle.time, value: currentEquity })
      
      if (currentEquity > maxEquity) {
        maxEquity = currentEquity
      }
      
      const drawdownValue = ((maxEquity - currentEquity) / maxEquity) * 100
      drawdown.push({ time: candle.time, value: drawdownValue })
    }

    return { trades, signals, equity, drawdown }
  }

  private calculateMetrics(
    trades: BacktestTrade[],
    equity: Array<{ time: UTCTimestamp; value: number }>,
    initialCapital: number
  ): BacktestMetrics {
    if (trades.length === 0) {
      return this.getEmptyMetrics()
    }

    const finalEquity = equity[equity.length - 1]?.value || initialCapital
    const totalReturn = finalEquity - initialCapital
    const totalReturnPercentage = (totalReturn / initialCapital) * 100

    const winningTrades = trades.filter(t => t.profit > 0)
    const losingTrades = trades.filter(t => t.profit < 0)
    
    const winRate = (winningTrades.length / trades.length) * 100
    const averageWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.profit, 0) / winningTrades.length : 0
    const averageLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0) / losingTrades.length) : 0
    const profitFactor = averageLoss > 0 ? averageWin / averageLoss : 0

    // Maksimum drawdown hesapla
    let maxDrawdown = 0
    let peak = initialCapital
    for (const point of equity) {
      if (point.value > peak) {
        peak = point.value
      }
      const drawdown = ((peak - point.value) / peak) * 100
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    }

    // Sharpe ratio hesapla (basitleştirilmiş)
    const returns = equity.slice(1).map((point, i) => 
      ((point.value - equity[i].value) / equity[i].value) * 100
    )
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length)
    const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0

    return {
      totalReturn,
      totalReturnPercentage,
      winRate,
      profitFactor,
      sharpeRatio,
      maxDrawdown,
      maxDrawdownPercentage: maxDrawdown,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      averageWin,
      averageLoss,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.profit)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.profit)) : 0,
      averageTradeDuration: trades.reduce((sum, t) => sum + t.duration, 0) / trades.length,
      maxConsecutiveWins: this.calculateMaxConsecutive(trades, true),
      maxConsecutiveLosses: this.calculateMaxConsecutive(trades, false),
      calmarRatio: maxDrawdown > 0 ? totalReturnPercentage / maxDrawdown : 0,
      sortinoRatio: sharpeRatio, // Basitleştirilmiş
      recoveryFactor: maxDrawdown > 0 ? totalReturnPercentage / maxDrawdown : 0
    }
  }

  private calculateMaxConsecutive(trades: BacktestTrade[], wins: boolean): number {
    let maxConsecutive = 0
    let currentConsecutive = 0
    
    for (const trade of trades) {
      if ((wins && trade.profit > 0) || (!wins && trade.profit < 0)) {
        currentConsecutive++
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
      } else {
        currentConsecutive = 0
      }
    }
    
    return maxConsecutive
  }

  private getEmptyMetrics(): BacktestMetrics {
    return {
      totalReturn: 0,
      totalReturnPercentage: 0,
      winRate: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      maxDrawdownPercentage: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      averageTradeDuration: 0,
      maxConsecutiveWins: 0,
      maxConsecutiveLosses: 0,
      calmarRatio: 0,
      sortinoRatio: 0,
      recoveryFactor: 0
    }
  }

  private generateParameterCombinations(parameters: OptimizationParameter[]): Record<string, any>[] {
    const combinations: Record<string, any>[] = []
    
    // Basit grid search implementasyonu
    const generateCombinations = (paramIndex: number, currentCombination: Record<string, any>) => {
      if (paramIndex >= parameters.length) {
        combinations.push({ ...currentCombination })
        return
      }

      const param = parameters[paramIndex]
      let values: any[] = []

      if (param.type === 'number' && param.min !== undefined && param.max !== undefined) {
        const step = param.step || 1
        for (let val = param.min; val <= param.max; val += step) {
          values.push(val)
        }
      } else if (param.values) {
        values = param.values
      } else {
        values = [param.current]
      }

      for (const value of values) {
        currentCombination[param.name] = value
        generateCombinations(paramIndex + 1, currentCombination)
      }
    }

    generateCombinations(0, {})
    return combinations
  }

  private applyParametersToStrategy(strategyCode: string, parameters: Record<string, any>): string {
    // strategyCode'un undefined olmaması için güvenli kontrol
    if (!strategyCode) {
      console.warn('Backtest Engine: strategyCode undefined, boş string döndürülüyor')
      return ''
    }
    
    let modifiedCode = strategyCode
    
    // Parametreleri kod içerisine uygula (basit string replacement)
    for (const [paramName, paramValue] of Object.entries(parameters)) {
      const regex = new RegExp(`\\b${paramName}\\s*=\\s*[^;\\n]+`, 'g')
      modifiedCode = modifiedCode.replace(regex, `${paramName} = ${paramValue}`)
    }
    
    return modifiedCode
  }

  private extractParametersFromResult(result: BacktestResult): Record<string, any> {
    // Best result'tan parametreleri çıkar (implementation gerekli)
    return {}
  }
}

export const backtestEngine = new BacktestEngine()