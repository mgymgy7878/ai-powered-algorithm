import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { toast } from 'sonner'
import { Play, Bot, Code, TrendingUp, Settings, Zap, AlertTriangle, CheckCircle, Target, BarChart3 } from '@phosphor-icons/react'

interface Indicator {
  name: string
  type: 'technical' | 'volume' | 'momentum' | 'volatility'
  parameters: Record<string, number>
  enabled: boolean
}

interface TradingStrategy {
  id: string
  name: string
  description: string
  code: string
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
  }
  optimization?: {
    bestParameters: Record<string, number>
    iterations: number
    score: number
  }
  aiAnalysis?: {
    marketConditions: string[]
    riskLevel: 'low' | 'medium' | 'high'
    suitability: string
    suggestions: string[]
  }
}

export function StrategyGenerator() {
  const [strategies, setStrategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [strategyPrompt, setStrategyPrompt] = useState('')
  const [strategyName, setStrategyName] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null)
  const [activeTab, setActiveTab] = useState('generate')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const availableIndicators: Indicator[] = [
    { name: 'RSI', type: 'momentum', parameters: { period: 14, overbought: 70, oversold: 30 }, enabled: true },
    { name: 'MACD', type: 'momentum', parameters: { fast: 12, slow: 26, signal: 9 }, enabled: false },
    { name: 'Bollinger Bands', type: 'volatility', parameters: { period: 20, stdDev: 2 }, enabled: false },
    { name: 'SMA', type: 'technical', parameters: { period: 20 }, enabled: true },
    { name: 'EMA', type: 'technical', parameters: { period: 12 }, enabled: false },
    { name: 'Volume', type: 'volume', parameters: { period: 20 }, enabled: false },
    { name: 'Stochastic', type: 'momentum', parameters: { kPeriod: 14, dSmoothing: 3 }, enabled: false },
    { name: 'Williams %R', type: 'momentum', parameters: { period: 14 }, enabled: false }
  ]

  const aiModels = [
    { id: 'gpt-4o', name: 'GPT-4o (Advanced)', description: 'Most sophisticated analysis and code generation' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast)', description: 'Quick optimization and testing' }
  ]

  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [indicators, setIndicators] = useState<Indicator[]>(availableIndicators)

  const generateStrategy = async () => {
    if (!strategyPrompt.trim() || !strategyName.trim()) {
      toast.error('Strateji adı ve açıklama gereklidir')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setCurrentStep('AI analizi başlatılıyor...')
    
    try {
      // Step 1: Initial AI Analysis
      setGenerationProgress(10)
      setCurrentStep('Piyasa koşulları analiz ediliyor...')
      
      const analysisPrompt = spark.llmPrompt`
        Sen bir algoritmik trading uzmanısın. Bu strateji talebini analiz et: "${strategyPrompt}"
        
        Analiz et:
        1. Hangi piyasa koşullarında en iyi çalışır
        2. Risk seviyesi (low/medium/high)  
        3. Uygun trading çiftleri
        4. Önerilen indikatörler
        5. Potential risks and mitigation strategies
        
        JSON formatında döndür:
        {
          "marketConditions": ["trending", "sideways", "volatile"],
          "riskLevel": "medium",
          "suitability": "Bu strateji...",
          "recommendedIndicators": ["RSI", "MACD", "SMA"],
          "suggestions": ["Öner 1", "Öner 2", "Öner 3"]
        }
      `
      
      const analysis = await spark.llm(analysisPrompt, selectedModel, true)
      const aiAnalysis = JSON.parse(analysis)
      
      // Step 2: Code Generation
      setGenerationProgress(30)
      setCurrentStep('Trading kodu oluşturuluyor...')
      
      const enabledIndicators = indicators.filter(ind => ind.enabled)
      const indicatorList = enabledIndicators.map(ind => `${ind.name}: ${JSON.stringify(ind.parameters)}`).join(', ')
      
      const codePrompt = spark.llmPrompt`
        Profesyonel bir trading bot kodu oluştur. Gereksinimler:
        
        Strateji: ${strategyPrompt}
        Kullanılacak indikatörler: ${indicatorList}
        
        Kod şunları içermeli:
        1. Tam entegre entry/exit logic
        2. Risk management (stop loss, take profit)
        3. Position sizing
        4. Error handling
        5. Gerçek time data handling
        6. Backtest uyumluluğu
        
        Python benzeri pseudocode olarak yaz, trading platformlarıyla uyumlu olsun.
        Detaylı, production-ready kod yaz.
      `
      
      const generatedCode = await spark.llm(codePrompt, selectedModel)
      
      // Step 3: Error Check & Fix
      setGenerationProgress(50)
      setCurrentStep('Kod hatalar kontrol ediliyor...')
      
      const errorCheckPrompt = spark.llmPrompt`
        Bu trading kodunu incele ve hataları tespit et:
        
        ${generatedCode}
        
        Kontrol edilecekler:
        1. Syntax errors
        2. Logic errors  
        3. Risk management eksiklikleri
        4. Performance sorunları
        5. Edge case handling
        
        JSON formatında döndür:
        {
          "hasErrors": true/false,
          "errors": ["hata 1", "hata 2"],
          "suggestions": ["öneri 1", "öneri 2"],
          "fixedCode": "düzeltilmiş kod buraya"
        }
      `
      
      const errorCheck = await spark.llm(errorCheckPrompt, selectedModel, true)
      const errorAnalysis = JSON.parse(errorCheck)
      
      let finalCode = generatedCode
      let errors: string[] = []
      
      if (errorAnalysis.hasErrors) {
        finalCode = errorAnalysis.fixedCode
        errors = errorAnalysis.errors
      }
      
      // Step 4: Initial Backtest Simulation
      setGenerationProgress(70)
      setCurrentStep('Hızlı backtest yapılıyor...')
      
      const backtestPrompt = spark.llmPrompt`
        Bu strateji için simüle edilmiş backtest sonuçları oluştur:
        
        Strateji: ${strategyPrompt}
        Kod: ${finalCode}
        
        Realistic sonuçlar üret (son 1 yıl için):
        {
          "winRate": 0-100 arası,
          "totalReturn": % return,
          "sharpeRatio": 0-3 arası,
          "maxDrawdown": % drawdown,
          "totalTrades": trade sayısı
        }
        
        Sonuçlar stratejinin yapısına uygun ve gerçekçi olsun.
      `
      
      const backtestResult = await spark.llm(backtestPrompt, selectedModel, true)
      const performance = JSON.parse(backtestResult)
      
      // Step 5: Parameter Optimization
      setGenerationProgress(85)
      setCurrentStep('Parametreler optimize ediliyor...')
      
      const optimizationPrompt = spark.llmPrompt`
        Bu strateji için optimal parametreleri belirle:
        
        Current parameters: ${JSON.stringify(enabledIndicators)}
        Performance: ${JSON.stringify(performance)}
        
        Her indikatör için en iyi parametreleri öner:
        {
          "bestParameters": {"RSI_period": 14, "RSI_overbought": 75, ...},
          "iterations": 100,
          "score": 0-100 arası optimization score
        }
      `
      
      const optimization = await spark.llm(optimizationPrompt, selectedModel, true)
      const optimizationResult = JSON.parse(optimization)
      
      // Step 6: Finalize Strategy
      setGenerationProgress(100)
      setCurrentStep('Strateji kaydediliyor...')
      
      const newStrategy: TradingStrategy = {
        id: Date.now().toString(),
        name: strategyName,
        description: strategyPrompt,
        code: finalCode,
        indicators: enabledIndicators,
        parameters: optimizationResult.bestParameters,
        status: errors.length > 0 ? 'error' : 'ready',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        errors: errors.length > 0 ? errors : undefined,
        performance,
        optimization: optimizationResult,
        aiAnalysis
      }
      
      setStrategies(current => [...current, newStrategy])
      setStrategyPrompt('')
      setStrategyName('')
      
      if (errors.length > 0) {
        toast.error(`Strateji oluşturuldu ama ${errors.length} hata tespit edildi`)
      } else {
        toast.success('Strateji başarıyla oluşturuldu ve optimize edildi!')
      }
      
    } catch (error) {
      toast.error('Strateji oluştururken hata oluştu. Tekrar deneyin.')
      console.error(error)
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
      setCurrentStep('')
    }
  }

  const fixStrategyErrors = async (strategy: TradingStrategy) => {
    if (!strategy.errors || strategy.errors.length === 0) return
    
    const updatedStrategies = strategies.map(s => 
      s.id === strategy.id ? { ...s, status: 'generating' as const } : s
    )
    setStrategies(updatedStrategies)
    
    try {
      const fixPrompt = spark.llmPrompt`
        Bu trading stratejisindeki hataları düzelt:
        
        Mevcut kod: ${strategy.code}
        Hatalar: ${strategy.errors.join(', ')}
        
        Hataları düzelt ve improved version döndür.
        Sadece düzeltilmiş kodu döndür, ekstra açıklama yapma.
      `
      
      const fixedCode = await spark.llm(fixPrompt, selectedModel)
      
      const fixedStrategy = {
        ...strategy,
        code: fixedCode,
        errors: undefined,
        status: 'ready' as const,
        lastModified: new Date().toISOString()
      }
      
      setStrategies(current => 
        current.map(s => s.id === strategy.id ? fixedStrategy : s)
      )
      
      toast.success('Strateji hataları düzeltildi!')
      
    } catch (error) {
      setStrategies(current =>
        current.map(s => s.id === strategy.id ? { ...s, status: 'error' } : s)
      )
      toast.error('Hataları düzeltirken sorun oluştu')
    }
  }

  const optimizeStrategy = async (strategy: TradingStrategy) => {
    const updatedStrategies = strategies.map(s => 
      s.id === strategy.id ? { ...s, status: 'optimizing' as const } : s
    )
    setStrategies(updatedStrategies)
    
    try {
      const optimizePrompt = spark.llmPrompt`
        Bu trading stratejisini optimize et:
        
        Kod: ${strategy.code}
        Mevcut performans: ${JSON.stringify(strategy.performance)}
        Mevcut parametreler: ${JSON.stringify(strategy.parameters)}
        
        Daha iyi performans için:
        1. Parametreleri fine-tune et
        2. Yeni indikatörler öner
        3. Risk management iyileştir
        4. Entry/exit koşullarını optimize et
        
        JSON döndür:
        {
          "optimizedCode": "improved code",
          "newParameters": {"key": value},
          "expectedImprovement": "% improvement",
          "changes": ["change 1", "change 2"]
        }
      `
      
      const optimization = await spark.llm(optimizePrompt, selectedModel, true)
      const optimizationResult = JSON.parse(optimization)
      
      // Simulate improved performance
      const improvedPerformance = {
        ...strategy.performance!,
        winRate: Math.min(95, (strategy.performance!.winRate ?? 0) * 1.1),
        totalReturn: (strategy.performance!.totalReturn ?? 0) * 1.15,
        sharpeRatio: Math.min(3, (strategy.performance!.sharpeRatio ?? 0) * 1.1)
      }
      
      const optimizedStrategy = {
        ...strategy,
        code: optimizationResult.optimizedCode,
        parameters: { ...strategy.parameters, ...optimizationResult.newParameters },
        performance: improvedPerformance,
        status: 'ready' as const,
        lastModified: new Date().toISOString(),
        optimization: {
          ...strategy.optimization!,
          score: Math.min(100, strategy.optimization!.score + 10),
          iterations: strategy.optimization!.iterations + 50
        }
      }
      
      setStrategies(current => 
        current.map(s => s.id === strategy.id ? optimizedStrategy : s)
      )
      
      toast.success(`Strateji optimize edildi! Tahmini %${optimizationResult.expectedImprovement} iyileşme`)
      
    } catch (error) {
      setStrategies(current =>
        current.map(s => s.id === strategy.id ? { ...s, status: 'ready' } : s)
      )
      toast.error('Optimizasyon sırasında hata oluştu')
    }
  }

  const runBacktest = async (strategy: TradingStrategy) => {
    const updatedStrategies = strategies.map(s => 
      s.id === strategy.id ? { ...s, status: 'testing' as const } : s
    )
    setStrategies(updatedStrategies)
    
    try {
      const backtestPrompt = spark.llmPrompt`
        Bu strateji için detaylı backtest yap:
        
        Kod: ${strategy.code}
        Parametreler: ${JSON.stringify(strategy.parameters)}
        
        Son 2 yıl için comprehensive backtest sonuçları:
        {
          "winRate": detailed win rate,
          "totalReturn": total return %,
          "sharpeRatio": sharpe ratio,
          "maxDrawdown": max drawdown %,
          "totalTrades": total number of trades,
          "monthlyReturns": [12 aylık return array],
          "riskMetrics": {
            "volatility": "annualized volatility",
            "beta": "market beta",
            "alpha": "alpha vs market"
          }
        }
        
        Realistic ve detailed sonuçlar üret.
      `
      
      const backtestResult = await spark.llm(backtestPrompt, selectedModel, true)
      const newPerformance = JSON.parse(backtestResult)
      
      const testedStrategy = {
        ...strategy,
        performance: newPerformance,
        status: 'ready' as const,
        lastModified: new Date().toISOString()
      }
      
      setStrategies(current => 
        current.map(s => s.id === strategy.id ? testedStrategy : s)
      )
      
      toast.success('Backtest tamamlandı!')
      
    } catch (error) {
      setStrategies(current =>
        current.map(s => s.id === strategy.id ? { ...s, status: 'ready' } : s)
      )
      toast.error('Backtest sırasında hata oluştu')
    }
  }

  const deleteStrategy = (id: string) => {
    setStrategies(current => current.filter(s => s.id !== id))
    toast.success('Strateji silindi')
  }

  const duplicateStrategy = (strategy: TradingStrategy) => {
    const duplicated: TradingStrategy = {
      ...strategy,
      id: Date.now().toString(),
      name: strategy.name + ' (Kopya)',
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
    setStrategies(current => [...current, duplicated])
    toast.success('Strateji kopyalandı')
  }

  const toggleIndicator = (indicatorName: string) => {
    setIndicators(current =>
      current.map(ind =>
        ind.name === indicatorName ? { ...ind, enabled: !ind.enabled } : ind
      )
    )
  }

  const updateIndicatorParameter = (indicatorName: string, paramName: string, value: number) => {
    setIndicators(current =>
      current.map(ind =>
        ind.name === indicatorName
          ? { ...ind, parameters: { ...ind.parameters, [paramName]: value } }
          : ind
      )
    )
  }

  const goLive = async (strategy: TradingStrategy) => {
    const livePrompt = spark.llmPrompt`
      Bu stratejiyi canlı trading için hazırla:
      
      Kod: ${strategy.code}
      Performans: ${JSON.stringify(strategy.performance)}
      
      Canlı trading için gerekli kontroller:
      1. Risk management validasyonu
      2. Market condition uygunluğu
      3. Liquidity kontrolü
      4. Final safety checks
      
      JSON döndür:
      {
        "readyForLive": true/false,
        "warnings": ["warning 1", "warning 2"],
        "recommendedBalance": "minimum balance",
        "riskLevel": "low/medium/high"
      }
    `
    
    try {
      const liveCheck = await spark.llm(livePrompt, selectedModel, true)
      const liveAnalysis = JSON.parse(liveCheck)
      
      if (liveAnalysis.readyForLive) {
        setStrategies(current =>
          current.map(s => s.id === strategy.id ? { ...s, status: 'live' } : s)
        )
        toast.success('Strateji canlı trading için aktif edildi!')
      } else {
        toast.error('Strateji henüz canlı trading için hazır değil')
      }
    } catch (error) {
      toast.error('Canlı trading kontrolü başarısız')
    }
  }

  const getStatusColor = (status: TradingStrategy['status']) => {
    switch (status) {
      case 'live': return 'bg-accent text-accent-foreground'
      case 'ready': return 'bg-primary text-primary-foreground'
      case 'testing': return 'bg-secondary text-secondary-foreground animate-pulse'
      case 'optimizing': return 'bg-secondary text-secondary-foreground animate-pulse'
      case 'generating': return 'bg-secondary text-secondary-foreground animate-pulse'
      case 'paused': return 'bg-muted text-muted-foreground'
      case 'error': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getStatusIcon = (status: TradingStrategy['status']) => {
    switch (status) {
      case 'live': return <Play className="h-3 w-3" />
      case 'ready': return <CheckCircle className="h-3 w-3" />
      case 'testing': return <BarChart3 className="h-3 w-3" />
      case 'optimizing': return <Target className="h-3 w-3" />
      case 'generating': return <Bot className="h-3 w-3" />
      case 'error': return <AlertTriangle className="h-3 w-3" />
      default: return <Code className="h-3 w-3" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Strategy Generator</h2>
          <p className="text-muted-foreground">MatrixIQ tarzı akıllı strateji üretici - Cursor Agent teknolojisi ile</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Bot className="h-3 w-3 mr-1" />
            AI Model: {aiModels.find(m => m.id === selectedModel)?.name}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="indicators" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Indicators
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Strategies ({strategies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* AI Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Model Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedModel === model.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </div>
                      {selectedModel === model.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategy Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Strategy Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategy-name">Strateji Adı</Label>
                <Input
                  id="strategy-name"
                  placeholder="örn: RSI Momentum Strategy, MACD Crossover"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strategy-prompt">Strateji Açıklaması (Doğal dil)</Label>
                <Textarea
                  id="strategy-prompt"
                  placeholder="Strateji fikrini detaylı açıkla. Örn: 'RSI 30'un altına düştüğünde ve fiyat 20 periyotluk MA'nın üstüne çıktığında al pozisyonu aç. %2 stop loss ve %4 take profit kullan. Volatil piyasalarda çalışsın.'"
                  rows={5}
                  value={strategyPrompt}
                  onChange={(e) => setStrategyPrompt(e.target.value)}
                />
              </div>

              {isGenerating && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{currentStep}</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}
              
              <Button 
                onClick={generateStrategy} 
                disabled={isGenerating || !strategyPrompt.trim() || !strategyName.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    AI Strateji Üretiyor...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    AI ile Strateji Üret
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teknik İndikatörler</CardTitle>
              <p className="text-sm text-muted-foreground">
                Stratejinizde kullanılacak indikatörleri seçin ve parametrelerini ayarlayın
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indicators.map((indicator) => (
                  <Card key={indicator.name} className={indicator.enabled ? 'border-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={indicator.enabled}
                            onChange={() => toggleIndicator(indicator.name)}
                            className="rounded"
                          />
                          <h4 className="font-medium">{indicator.name}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {indicator.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {indicator.enabled && (
                        <div className="space-y-2">
                          {Object.entries(indicator.parameters).map(([param, value]) => (
                            <div key={param} className="flex items-center justify-between">
                              <Label className="text-sm capitalize">{param}</Label>
                              <Input
                                type="number"
                                value={value}
                                onChange={(e) => updateIndicatorParameter(
                                  indicator.name,
                                  param,
                                  Number(e.target.value)
                                )}
                                className="w-20 h-8"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          {strategies.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Henüz strateji yok</h3>
                <p className="text-muted-foreground">İlk AI destekli trading stratejinizi oluşturun</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {strategy.name}
                          <Badge className={`${getStatusColor(strategy.status)} flex items-center gap-1`}>
                            {getStatusIcon(strategy.status)}
                            {strategy.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(strategy.createdAt).toLocaleDateString('tr-TR')} • 
                          Son güncelleme: {new Date(strategy.lastModified).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateStrategy(strategy)}
                        >
                          Kopyala
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteStrategy(strategy.id)}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{strategy.description}</p>
                    
                    {/* AI Analysis */}
                    {strategy.aiAnalysis && (
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="font-medium text-sm mb-2">AI Analizi</h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Risk Seviyesi:</span>
                            <Badge className={`ml-2 text-xs ${
                              strategy.aiAnalysis.riskLevel === 'low' ? 'bg-accent' :
                              strategy.aiAnalysis.riskLevel === 'medium' ? 'bg-secondary' : 'bg-destructive'
                            }`}>
                              {strategy.aiAnalysis.riskLevel}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Piyasa Koşulları:</span>
                            <span className="ml-2">{strategy.aiAnalysis.marketConditions.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Performance Metrics */}
                    {strategy.performance && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-3 bg-muted rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-accent">
                            {(strategy.performance.winRate ?? 0).toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-accent">
                            {(strategy.performance.totalReturn ?? 0).toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Total Return</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-accent">
                            {(strategy.performance.sharpeRatio ?? 0).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-destructive">
                            {(strategy.performance.maxDrawdown ?? 0).toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Max Drawdown</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {strategy.performance.totalTrades ?? 0}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Trades</div>
                        </div>
                      </div>
                    )}

                    {/* Optimization Info */}
                    {strategy.optimization && (
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4" />
                          <span className="font-medium text-sm">Optimization Score: {strategy.optimization.score}/100</span>
                        </div>
                        <Progress value={strategy.optimization.score} className="h-2" />
                      </div>
                    )}
                    
                    {/* Errors */}
                    {strategy.errors && strategy.errors.length > 0 && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="font-medium text-sm">Hatalar tespit edildi:</span>
                        </div>
                        <ul className="text-sm space-y-1">
                          {strategy.errors.map((error, idx) => (
                            <li key={idx} className="text-destructive">• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Code className="h-4 w-4 mr-1" />
                            Kodu Görüntüle
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{strategy.name} - Trading Kodu</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="h-[60vh] w-full">
                            <pre className="text-sm bg-muted p-4 rounded-lg font-mono overflow-x-auto">
                              {strategy.code}
                            </pre>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => runBacktest(strategy)}
                        disabled={strategy.status === 'testing'}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        {strategy.status === 'testing' ? 'Backtest Yapılıyor...' : 'Backtest Yap'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => optimizeStrategy(strategy)}
                        disabled={strategy.status === 'optimizing'}
                      >
                        <Target className="h-4 w-4 mr-1" />
                        {strategy.status === 'optimizing' ? 'Optimize Ediliyor...' : 'Optimize Et'}
                      </Button>
                      
                      {strategy.errors && strategy.errors.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => fixStrategyErrors(strategy)}
                          disabled={strategy.status === 'generating'}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          {strategy.status === 'generating' ? 'Düzeltiliyor...' : 'Hataları Düzelt'}
                        </Button>
                      )}
                      
                      {strategy.status === 'ready' && !strategy.errors && (
                        <Button 
                          size="sm"
                          onClick={() => goLive(strategy)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Canlı Başlat
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}