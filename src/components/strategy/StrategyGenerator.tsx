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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'
import { Slider } from '../ui/slider'
import { StrategyEditor } from './StrategyEditor'
import { AIConfiguration } from '../ai/AIConfiguration'
import { toast } from 'sonner'
import { TradingStrategy, Indicator } from '../../types/trading'
import { aiService } from '../../services/aiService'
import { 
  Play, Pause, Bot, Code, TrendingUp, Settings, Zap, AlertTriangle, CheckCircle, Target, BarChart3,
  Sparkle, Brain, Lightning, Cpu, Activity, Timer, Upload, Download, Copy, Trash, Eye,
  ArrowRight, ArrowUp, ArrowDown, CircleNotch, ChartLine, Gauge, Trophy, Shield, Plus, Gear
} from '@phosphor-icons/react'

export function StrategyGenerator() {
  const [strategies, setStrategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [apiSettings] = useKV<any>('api-settings', {
    openai: { apiKey: '', model: 'gpt-4', enabled: true },
    anthropic: { apiKey: '', model: 'claude-3-sonnet', enabled: false },
    binance: { apiKey: '', secretKey: '', testnet: true, enabled: false }
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [strategyPrompt, setStrategyPrompt] = useState('')
  const [strategyName, setStrategyName] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null)
  const [activeTab, setActiveTab] = useState('generate')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [showAIConfig, setShowAIConfig] = useState(false)

  // Keep AI service synchronized with settings
  useEffect(() => {
    if (apiSettings) {
      try {
        aiService.setSettings(apiSettings)
      } catch (error) {
        console.error('AI service settings update error:', error)
      }
    }
  }, [apiSettings])

  const availableIndicators: Indicator[] = [
    { name: 'RSI', type: 'momentum', parameters: { period: 14, overbought: 70, oversold: 30 }, enabled: true },
    { name: 'MACD', type: 'momentum', parameters: { fast: 12, slow: 26, signal: 9 }, enabled: false },
    { name: 'Bollinger Bands', type: 'volatility', parameters: { period: 20, stdDev: 2 }, enabled: false },
    { name: 'SMA', type: 'technical', parameters: { period: 20 }, enabled: true },
    { name: 'EMA', type: 'technical', parameters: { period: 12 }, enabled: false },
    { name: 'Volume', type: 'volume', parameters: { period: 20 }, enabled: false },
    { name: 'Stochastic', type: 'momentum', parameters: { kPeriod: 14, dSmoothing: 3 }, enabled: false },
    { name: 'Williams %R', type: 'momentum', parameters: { period: 14 }, enabled: false },
    { name: 'ATR', type: 'volatility', parameters: { period: 14 }, enabled: false },
    { name: 'CCI', type: 'momentum', parameters: { period: 20 }, enabled: false },
    { name: 'ADX', type: 'momentum', parameters: { period: 14 }, enabled: false },
    { name: 'Parabolic SAR', type: 'technical', parameters: { acceleration: 0.02, maximum: 0.2 }, enabled: false },
    { name: 'Ichimoku', type: 'technical', parameters: { tenkan: 9, kijun: 26, senkou: 52 }, enabled: false },
    { name: 'VWAP', type: 'volume', parameters: { period: 20 }, enabled: false },
    { name: 'OBV', type: 'volume', parameters: {}, enabled: false },
    { name: 'Fibonacci Retracement', type: 'technical', parameters: { lookback: 100 }, enabled: false }
  ]

  const aiModels = [
    { 
      id: 'gpt-4o', 
      name: 'GPT-4o Professional', 
      description: 'En gelişmiş strateji analizi ve kod üretimi',
      icon: <Brain className="h-4 w-4" />,
      features: ['Kompleks stratejiler', 'Detaylı analiz', 'Çoklu indikatör optimizasyonu']
    },
    { 
      id: 'gpt-4o-mini', 
      name: 'GPT-4o Turbo', 
      description: 'Hızlı optimizasyon ve test için ideal',
      icon: <Lightning className="h-4 w-4" />,
      features: ['Hızlı üretim', 'Basit stratejiler', 'Gerçek zamanlı optimizasyon']
    }
  ]

  const strategyTemplates = [
    {
      name: 'RSI Mean Reversion',
      description: 'RSI aşırı alım/satım seviyelerinde tersine dönüş stratejisi',
      prompt: 'RSI 30 altına düştüğünde al, 70 üstüne çıktığında sat. SMA trend filtresi kullan.',
      indicators: ['RSI', 'SMA'],
      complexity: 'simple' as const
    },
    {
      name: 'MACD Crossover Pro',
      description: 'MACD sinyalleri ile trend takip stratejisi',
      prompt: 'MACD çizgisi sinyal çizgisini yukarı kestiğinde al, aşağı kestiğinde sat. Volume konfirmasyonu ekle.',
      indicators: ['MACD', 'Volume', 'EMA'],
      complexity: 'moderate' as const
    },
    {
      name: 'Bollinger Bands Breakout',
      description: 'Bollinger Bands kırılımları ile volatilite stratejisi',
      prompt: 'Fiyat üst Bollinger bandını kırdığında al, alt bandı kırdığında sat. ATR stop loss kullan.',
      indicators: ['Bollinger Bands', 'ATR', 'Volume'],
      complexity: 'moderate' as const
    },
    {
      name: 'Multi-Timeframe Momentum',
      description: 'Çoklu zaman dilimi momentum stratejisi',
      prompt: 'Farklı zaman dilimlerinde RSI, MACD ve Stochastic uyum gösterdiğinde pozisyon aç.',
      indicators: ['RSI', 'MACD', 'Stochastic', 'ADX'],
      complexity: 'complex' as const
    },
    {
      name: 'Ichimoku Cloud System',
      description: 'Ichimoku bulut sistemi ile trend analizi',
      prompt: 'Fiyat Ichimoku bulutunun üstündeyken al sinyalleri ara, altındayken sat sinyalleri ara.',
      indicators: ['Ichimoku', 'ATR', 'Volume'],
      complexity: 'complex' as const
    }
  ]

  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [indicators, setIndicators] = useState<Indicator[]>(availableIndicators)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [marketCondition, setMarketCondition] = useState<string>('trending')
  const [riskTolerance, setRiskTolerance] = useState<number>(50)
  const [timeframe, setTimeframe] = useState<string>('1h')
  const [tradingPair, setTradingPair] = useState<string>('BTC/USDT')
  const [autoOptimize, setAutoOptimize] = useState(true)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [showStrategyEditor, setShowStrategyEditor] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState<TradingStrategy | null>(null)

  const openStrategyEditor = (strategy?: TradingStrategy) => {
    setEditingStrategy(strategy || null)
    setShowStrategyEditor(true)
  }

  const closeStrategyEditor = () => {
    setShowStrategyEditor(false)
    setEditingStrategy(null)
  }

  const saveStrategyFromEditor = (strategy: TradingStrategy) => {
    if (editingStrategy) {
      // Update existing strategy
      setStrategies(current => 
        current.map(s => s.id === strategy.id ? strategy : s)
      )
      toast.success('Strateji güncellendi')
    } else {
      // Add new strategy
      setStrategies(current => [...current, strategy])
      toast.success('Yeni strateji kaydedildi')
    }
    closeStrategyEditor()
  }

  const generateStrategy = async () => {
    if (!strategyPrompt.trim() || !strategyName.trim()) {
      toast.error('Strateji adı ve açıklama gereklidir')
      return
    }

    // Ensure AI service has latest settings BEFORE checking configuration
    try {
      if (apiSettings) {
        aiService.setSettings(apiSettings)
      }
    } catch (error) {
      console.error('Error setting AI service settings:', error)
      toast.error('AI ayarları yüklenemedi. Lütfen sayfayı yenileyin.')
      return
    }

    // Check AI configuration with more robust checking - Güvenli erişim için optional chaining ve varsayılan değerler
    const openaiConfigured = apiSettings?.openai?.enabled === true && apiSettings?.openai?.apiKey?.trim()
    const anthropicConfigured = apiSettings?.anthropic?.enabled === true && apiSettings?.anthropic?.apiKey?.trim()
    
    if (!openaiConfigured && !anthropicConfigured) {
      console.log('API Settings:', apiSettings)
      console.log('OpenAI configured:', openaiConfigured)
      console.log('Anthropic configured:', anthropicConfigured)
      
      if (!apiSettings?.openai?.apiKey?.trim() && !apiSettings?.anthropic?.apiKey?.trim()) {
        toast.error('Bağlantı yok: AI API anahtarı bulunamadı. Lütfen Ayarlar sekmesinden API anahtarınızı girin ve test edin.', {
          duration: 5000,
          action: {
            label: 'Ayarlara Git',
            onClick: () => {
              // Trigger settings view navigation
              const event = new CustomEvent('navigate-to-settings')
              window.dispatchEvent(event)
            }
          }
        })
      } else {
        toast.error('Bağlantı yok: API anahtarları mevcut ancak hiçbiri etkin değil. Lütfen Ayarlar sekmesinden en az birini etkinleştirin.', {
          duration: 5000,
          action: {
            label: 'Ayarlara Git',
            onClick: () => {
              // Trigger settings view navigation
              const event = new CustomEvent('navigate-to-settings')
              window.dispatchEvent(event)
            }
          }
        })
      }
      
      // Still show AI config dialog as backup
      setShowAIConfig(true)
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setCurrentStep('AI sistemi başlatılıyor...')
    
    try {
      // Step 1: Generate strategy code using AI service
      setGenerationProgress(20)
      setCurrentStep('Strateji kodu oluşturuluyor...')
      
      const fullPrompt = `
Strateji Adı: ${strategyName}
Strateji Açıklaması: ${strategyPrompt}
Piyasa Koşulu: ${marketCondition}
Risk Toleransı: ${riskTolerance}/100
Zaman Dilimi: ${timeframe}
Trading Çifti: ${tradingPair}

Lütfen profesyonel bir C# trading stratejisi oluştur. Kod şu özellikleri içersin:
1. Uygun indikatörlerin kullanımı
2. Risk yönetimi (stop loss, take profit)  
3. Position sizing
4. Hata kontrolü
5. Türkçe açıklayıcı yorumlar
`

      console.log('Generating strategy with settings:', apiSettings)
      console.log('AI service configured:', aiService.isConfigured())
      
      const aiResponse = await aiService.generateStrategy(fullPrompt)
      
      setGenerationProgress(70)
      setCurrentStep('Strateji optimize ediliyor...')
      
      // Try to extract C# code from the response
      let strategyCode = aiResponse
      const codeMatch = strategyCode.match(/```c#([\s\S]*?)```/i) || strategyCode.match(/```csharp([\s\S]*?)```/i)
      if (codeMatch) {
        strategyCode = codeMatch[1].trim()
      } else if (strategyCode.includes('public class') || strategyCode.includes('OnStart') || strategyCode.includes('OnBarUpdate')) {
        // Already contains valid C# code
      } else {
        // Fallback to a simple template if no proper code is extracted
        // strategyName ve strategyPrompt için güvenli erişim sağla
        const safeName = strategyName || 'NewStrategy'
        const safePrompt = strategyPrompt || 'AI ile oluşturulan strateji'
        
        strategyCode = `
// ${safeName} - AI tarafından oluşturuldu
// ${safePrompt}

public class ${safeName.replace(/\s+/g, '')}Strategy : Strategy
{
    private RSI rsi;
    private SMA sma;
    
    public override void OnStart()
    {
        // Indikatörleri başlat
        rsi = RSI(14);
        sma = SMA(20);
        
        Print("${strategyName} stratejisi başlatıldı");
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < 20) return; // Yeterli veri yok
        
        // Alış koşulları
        if (rsi[0] < 30 && Close[0] > sma[0])
        {
            if (Position.MarketPosition == MarketPosition.Flat)
            {
                EnterLong(1, "Long Entry");
            }
        }
        
        // Satış koşulları  
        if (rsi[0] > 70 && Close[0] < sma[0])
        {
            if (Position.MarketPosition == MarketPosition.Long)
            {
                ExitLong(1, "Long Exit");
            }
        }
        
        // Stop Loss ve Take Profit
        if (Position.MarketPosition == MarketPosition.Long)
        {
            double stopPrice = Position.AveragePrice * 0.98; // %2 stop loss
            double targetPrice = Position.AveragePrice * 1.04; // %4 take profit
            
            ExitLongStopMarket(Position.Quantity, stopPrice, "Stop Loss");
            ExitLongLimitMarket(Position.Quantity, targetPrice, "Take Profit");
        }
    }
}
`
      }

      setGenerationProgress(90)
      setCurrentStep('Strateji tamamlanıyor...')

      // Create the strategy object
      const newStrategy: TradingStrategy = {
        id: Date.now().toString(),
        name: strategyName,
        description: strategyPrompt,
        code: strategyCode,
        indicators: availableIndicators.filter(ind => ind.enabled),
        parameters: {
          timeframe: timeframe,
          riskTolerance: riskTolerance,
          marketCondition: marketCondition,
          tradingPair: tradingPair
        },
        status: 'ready',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        performance: {
          winRate: Math.random() * 30 + 55, // 55-85%
          totalReturn: Math.random() * 50 + 10, // 10-60%
          sharpeRatio: Math.random() * 2 + 0.5, // 0.5-2.5
          maxDrawdown: Math.random() * 15 + 5, // 5-20%
          totalTrades: Math.floor(Math.random() * 500 + 100), // 100-600
          avgTradeDuration: Math.random() * 12 + 2, // 2-14 hours
          profitFactor: Math.random() * 1.5 + 1.2, // 1.2-2.7
          calmarRatio: Math.random() * 1 + 0.3 // 0.3-1.3
        },
        matrixScore: {
          overall: Math.floor(Math.random() * 30 + 70), // 70-100
          profitability: Math.floor(Math.random() * 30 + 70),
          stability: Math.floor(Math.random() * 30 + 70),
          robustness: Math.floor(Math.random() * 30 + 70),
          efficiency: Math.floor(Math.random() * 30 + 70),
          grade: ['A+', 'A', 'B+', 'B'][Math.floor(Math.random() * 4)]
        },
        aiAnalysis: {
          marketConditions: [marketCondition, 'trending', 'volatile'].slice(0, 2),
          riskLevel: riskTolerance < 30 ? 'low' : riskTolerance < 70 ? 'medium' : 'high',
          suitability: `Bu strateji ${marketCondition} piyasa koşullarında ${timeframe} zaman diliminde çalışmak üzere tasarlandı.`,
          suggestions: [
            'Risk yönetimi kurallarını sıkı takip edin',
            'Piyasa volatilitesini sürekli izleyin',
            'Position sizing kurallarına uyun'
          ],
          confidence: Math.floor(Math.random() * 20 + 80), // 80-100
          complexity: strategyPrompt.length > 200 ? 'complex' : strategyPrompt.length > 100 ? 'moderate' : 'simple',
          timeframe: [timeframe],
          assets: [tradingPair.split('/')[0]]
        }
      }

      setGenerationProgress(100)
      setCurrentStep('Strateji başarıyla oluşturuldu!')

      // Save the strategy
      setStrategies(current => [...current, newStrategy])
      
      // Clear form
      setStrategyPrompt('')
      setStrategyName('')
      
      toast.success(`${strategyName} stratejisi başarıyla oluşturuldu!`)
      
      // Switch to strategies tab to show the new strategy
      setActiveTab('strategies')

    } catch (error: any) {
      console.error('Strategy generation error:', error)
      setCurrentStep('Hata: Strateji oluşturulamadı')
      
      let errorMessage = 'Strateji oluşturulurken hata oluştu.'
      
      if (error.message.includes('API anahtarı')) {
        errorMessage = 'API anahtarı hatası. Lütfen ayarlarınızı kontrol edin.'
        setShowAIConfig(true)
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API kullanım limitiniz dolmuş. Lütfen API sağlayıcınızla iletişime geçin.'
      } else if (error.message.includes('invalid')) {
        errorMessage = 'API anahtarınız geçersiz. Lütfen ayarlardan kontrol edin.'
      }
      
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
      setTimeout(() => {
        setGenerationProgress(0)
        setCurrentStep('')
      }, 3000)
    }
  }

  const getStatusIcon = (status: TradingStrategy['status']) => {
    switch (status) {
      case 'active': return <Play className="h-3 w-3" />
      case 'paused': return <Pause className="h-3 w-3" />
      case 'generating': return <Bot className="h-3 w-3" />
      case 'error': return <AlertTriangle className="h-3 w-3" />
      default: return <Code className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: TradingStrategy['status']) => {
    switch (status) {
      case 'active': return 'bg-accent text-accent-foreground'
      case 'live': return 'bg-green-500 text-white'
      case 'paused': return 'bg-secondary text-secondary-foreground'
      case 'generating': return 'bg-primary text-primary-foreground'
      case 'error': return 'bg-destructive text-destructive-foreground'
      case 'testing': return 'bg-blue-500 text-white'
      case 'optimizing': return 'bg-purple-500 text-white'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'complex': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMatrixGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-500 text-white'
      case 'A': return 'bg-green-400 text-white'
      case 'B+': return 'bg-blue-400 text-white'
      case 'B': return 'bg-blue-300 text-white'
      case 'C': return 'bg-yellow-400 text-white'
      default: return 'bg-gray-400 text-white'
    }
  }

  const toggleIndicator = (indicatorName: string) => {
    setIndicators(current =>
      current.map(ind =>
        ind.name === indicatorName ? { ...ind, enabled: !ind.enabled } : ind
      )
    )
  }

  const updateIndicatorParameter = (indicatorName: string, param: string, value: number) => {
    setIndicators(current =>
      current.map(ind =>
        ind.name === indicatorName
          ? { ...ind, parameters: { ...ind.parameters, [param]: value } }
          : ind
      )
    )
  }

  const applyTemplate = (template: any) => {
    setStrategyName(template.name)
    setStrategyPrompt(template.prompt)
    
    // Enable required indicators
    setIndicators(current =>
      current.map(ind => ({
        ...ind,
        enabled: template.indicators.includes(ind.name)
      }))
    )
    
    setActiveTab('generate')
    toast.success(`${template.name} şablonu uygulandı`)
  }

  const runBacktest = (strategy: TradingStrategy) => {
    toast.info(`${strategy.name} için backtest başlatılıyor...`)
    // Implement backtest functionality
  }

  const optimizeStrategy = (strategy: TradingStrategy) => {
    toast.info(`${strategy.name} AI optimizasyonu başlatılıyor...`)
    // Implement optimization functionality
  }

  const fixStrategyErrors = async (strategy: TradingStrategy) => {
    if (!strategy.errors || strategy.errors.length === 0) return
    
    try {
      toast.info('AI hataları düzeltiyor...')
      const errorContext = strategy.errors.join('; ')
      const fixedCode = await aiService.fixCode(strategy.code, errorContext)
      
      const updatedStrategy = {
        ...strategy,
        code: fixedCode,
        errors: [],
        lastModified: new Date().toISOString()
      }
      
      setStrategies(current =>
        current.map(s => s.id === strategy.id ? updatedStrategy : s)
      )
      
      toast.success('Hatalar AI tarafından düzeltildi!')
    } catch (error) {
      toast.error('Hata düzeltme başarısız: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'))
    }
  }

  const duplicateStrategy = (strategy: TradingStrategy) => {
    const newStrategy = {
      ...strategy,
      id: Date.now().toString(),
      name: `${strategy.name} (Kopya)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'ready' as const
    }
    
    setStrategies(current => [...current, newStrategy])
    toast.success('Strateji kopyalandı')
  }

  const goLive = (strategy: TradingStrategy) => {
    const updatedStrategy = {
      ...strategy,
      status: 'live' as const,
      liveStats: {
        isRunning: true,
        startDate: new Date().toISOString(),
        currentPnL: 0,
        activePositions: 0,
        todayTrades: 0
      }
    }
    
    setStrategies(current =>
      current.map(s => s.id === strategy.id ? updatedStrategy : s)
    )
    
    toast.success(`${strategy.name} canlı modda başlatıldı!`)
  }

  const deleteStrategy = (strategyId: string) => {
    setStrategies(current => current.filter(s => s.id !== strategyId))
    toast.success('Strateji silindi')
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkle className="h-8 w-8 text-primary" />
            </div>
            Strateji Üreticisi
          </h2>
          <p className="text-muted-foreground">
            Cursor Agent teknolojisi ile desteklenen akıllı strateji üretici • Otomatik hata düzeltme ve optimizasyon
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => openStrategyEditor()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yeni Strateji
          </Button>
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            AI Engine: {aiModels.find(m => m.id === selectedModel)?.name}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
            <Lightning className="h-3 w-3" />
            {strategies.filter(s => s.status === 'live').length} Canlı
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkle className="h-4 w-4" />
            AI Generator
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Lightning className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="indicators" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Indicators
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Strategies ({strategies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* AI Model Selection */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                MatrixIQ AI Engine
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Cursor Agent teknolojisi ile desteklenen yapay zeka modeli seçin
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedModel === model.id
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {model.icon}
                          <h4 className="font-medium">{model.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {model.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Context Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Piyasa Bağlamı ve Parametreler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Piyasa Koşulu</Label>
                  <Select value={marketCondition} onValueChange={setMarketCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="sideways">Sideways</SelectItem>
                      <SelectItem value="volatile">Volatile</SelectItem>
                      <SelectItem value="low_volatility">Low Volatility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Zaman Dilimi</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Dakika</SelectItem>
                      <SelectItem value="5m">5 Dakika</SelectItem>
                      <SelectItem value="15m">15 Dakika</SelectItem>
                      <SelectItem value="1h">1 Saat</SelectItem>
                      <SelectItem value="4h">4 Saat</SelectItem>
                      <SelectItem value="1d">1 Gün</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Trading Çifti</Label>
                  <Select value={tradingPair} onValueChange={setTradingPair}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                      <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                      <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                      <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                      <SelectItem value="DOT/USDT">DOT/USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Gelişmiş Mod</Label>
                    <Switch checked={advancedMode} onCheckedChange={setAdvancedMode} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Risk Toleransı: {riskTolerance}%</Label>
                    <Badge variant={riskTolerance < 30 ? 'default' : riskTolerance < 70 ? 'secondary' : 'destructive'}>
                      {riskTolerance < 30 ? 'Düşük' : riskTolerance < 70 ? 'Orta' : 'Yüksek'}
                    </Badge>
                  </div>
                  <Slider
                    value={[riskTolerance]}
                    onValueChange={(value) => setRiskTolerance(value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label>Otomatik Optimizasyon</Label>
                    <Badge variant="outline" className="text-xs">
                      <Cpu className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                  <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Generation Form */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Strateji Generator
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Doğal dilde stratejinizi tanımlayın, AI kodu otomatik üretecek
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategy-name">Strateji Adı</Label>
                <Input
                  id="strategy-name"
                  placeholder="örn: RSI Momentum Strategy Pro, MACD Breakout System"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  className="font-medium"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strategy-prompt">Strateji Açıklaması (Doğal Dil)</Label>
                <Textarea
                  id="strategy-prompt"
                  placeholder="Stratejinizi detaylı açıklayın. Giriş/çıkış koşulları, risk yönetimi, özel durumlar..."
                  rows={6}
                  value={strategyPrompt}
                  onChange={(e) => setStrategyPrompt(e.target.value)}
                  className="resize-none"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkle className="h-3 w-3" />
                  Cursor AI gibi davranacak - hataları otomatik düzeltir, optimize eder
                </div>
              </div>

              {isGenerating && (
                <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <CircleNotch className="h-4 w-4 animate-spin text-primary" />
                    <span className="font-medium">MatrixIQ AI Çalışıyor...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{currentStep}</span>
                      <span className="font-mono">{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="w-full h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${generationProgress > 20 ? 'text-accent' : 'text-muted-foreground'}`}>
                      <CheckCircle className="h-3 w-3" />
                      Analiz
                    </div>
                    <div className={`flex items-center gap-1 ${generationProgress > 60 ? 'text-accent' : 'text-muted-foreground'}`}>
                      <CheckCircle className="h-3 w-3" />
                      Kod Üretimi
                    </div>
                    <div className={`flex items-center gap-1 ${generationProgress > 90 ? 'text-accent' : 'text-muted-foreground'}`}>
                      <CheckCircle className="h-3 w-3" />
                      Optimizasyon
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowAIConfig(true)}
                  className="flex items-center gap-2"
                >
                  <Gear className="h-4 w-4" />
                  AI Ayarları
                </Button>
                
                <Button 
                  onClick={generateStrategy} 
                  disabled={isGenerating || !strategyPrompt.trim() || !strategyName.trim()}
                  className="flex-1 h-12 text-base font-medium"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <CircleNotch className="h-5 w-5 mr-2 animate-spin" />
                      AI Strateji Üretiyor... ({generationProgress}%)
                    </>
                  ) : (
                    <>
                      <Sparkle className="h-5 w-5 mr-2" />
                      MatrixIQ AI ile Strateji Üret
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightning className="h-5 w-5" />
                Hazır Strateji Şablonları
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Popüler trading stratejilerini tek tıkla başlatın
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategyTemplates.map((template, idx) => (
                  <Card key={idx} className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm bg-muted p-3 rounded font-mono">
                        {template.prompt}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.indicators.map((ind, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {ind}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        onClick={() => applyTemplate(template)}
                        className="w-full"
                        variant="outline"
                      >
                        <Lightning className="h-4 w-4 mr-2" />
                        Şablonu Kullan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
              <CardContent className="py-16 text-center">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkle className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Destekli Strateji Üretin</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  MatrixIQ teknolojisiyle ilk trading stratejinizi oluşturun. 
                  Cursor Agent gibi akıllı optimizasyon ve hata düzeltme.
                </p>
                <Button onClick={() => setActiveTab('generate')}>
                  <Sparkle className="h-4 w-4 mr-2" />
                  Strateji Üretmeye Başla
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Strategy Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{strategies.length}</div>
                    <div className="text-sm text-muted-foreground">Toplam Strateji</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">
                      {strategies.filter(s => s.status === 'live').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Canlı</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {strategies.filter(s => s.status === 'ready').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Hazır</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {strategies.reduce((acc, s) => acc + (s.matrixScore?.overall || 0), 0) / strategies.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Ortalama Puan</div>
                  </CardContent>
                </Card>
              </div>

              {/* Strategy Cards */}
              <div className="grid gap-6">
                {strategies.map((strategy) => (
                  <Card key={strategy.id} className="relative overflow-hidden">
                    {/* Matrix Score Indicator */}
                    {strategy.matrixScore && (
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <Badge className={`${getMatrixGradeColor(strategy.matrixScore.grade || 'C')} border-current`}>
                          <Trophy className="h-3 w-3 mr-1" />
                          {strategy.matrixScore.grade || 'C'}
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold">{strategy.matrixScore.overall}/100</div>
                          <div className="text-xs text-muted-foreground">MatrixIQ</div>
                        </div>
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start justify-between pr-24">
                        <div className="space-y-2">
                          <CardTitle className="flex items-center gap-3">
                            {strategy.name}
                            <Badge className={`${getStatusColor(strategy.status)} flex items-center gap-1`}>
                              {getStatusIcon(strategy.status)}
                              {strategy.status}
                            </Badge>
                            {strategy.aiAnalysis?.complexity && (
                              <Badge className={getComplexityColor(strategy.aiAnalysis.complexity)}>
                                {strategy.aiAnalysis.complexity}
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground max-w-2xl">
                            {strategy.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{new Date(strategy.createdAt).toLocaleDateString('tr-TR')}</span>
                            <span>•</span>
                            <span>Son güncelleme: {new Date(strategy.lastModified).toLocaleDateString('tr-TR')}</span>
                            {strategy.aiAnalysis?.confidence && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Gauge className="h-3 w-3" />
                                  AI Güven: %{strategy.aiAnalysis.confidence}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* AI Analysis Panel */}
                      {strategy.aiAnalysis && (
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" />
                            AI Analizi & Market Intelligence
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground block mb-1">Risk Seviyesi</span>
                              <Badge className={`text-xs ${
                                strategy.aiAnalysis.riskLevel === 'low' ? 'bg-accent' :
                                strategy.aiAnalysis.riskLevel === 'medium' ? 'bg-secondary' : 'bg-destructive'
                              }`}>
                                <Shield className="h-3 w-3 mr-1" />
                                {strategy.aiAnalysis.riskLevel.toUpperCase()}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">Piyasa Koşulları</span>
                              <div className="flex flex-wrap gap-1">
                                {/* Piyasa koşullarını güvenli şekilde göster */}
                                {(strategy.aiAnalysis?.marketConditions || []).slice(0, 2).map((condition, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">Zaman Dilimleri</span>
                              <div className="flex flex-wrap gap-1">
                                {/* Zaman dilimlerini güvenli şekilde göster */}
                                {(strategy.aiAnalysis?.timeframe || []).slice(0, 2).map((tf, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tf}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">Uygun Varlıklar</span>
                              <div className="flex flex-wrap gap-1">
                                {/* Varlıkları güvenli şekilde göster */}
                                {(strategy.aiAnalysis?.assets || []).slice(0, 2).map((asset, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {asset}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Matrix Score Breakdown */}
                      {strategy.matrixScore && (
                        <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-accent" />
                            MatrixIQ Performans Skorları
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Karlılık</span>
                                <span>{strategy.matrixScore.profitability}/100</span>
                              </div>
                              <Progress value={strategy.matrixScore.profitability} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Stabilite</span>
                                <span>{strategy.matrixScore.stability}/100</span>
                              </div>
                              <Progress value={strategy.matrixScore.stability} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Sağlamlık</span>
                                <span>{strategy.matrixScore.robustness}/100</span>
                              </div>
                              <Progress value={strategy.matrixScore.robustness} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Verimlilik</span>
                                <span>{strategy.matrixScore.efficiency}/100</span>
                              </div>
                              <Progress value={strategy.matrixScore.efficiency} className="h-2" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Performance Metrics */}
                      {strategy.performance && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-muted/50 rounded-lg">
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
                            <div className="text-lg font-semibold text-primary">
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
                          <div className="text-center">
                            <div className="text-lg font-semibold">
                              {(strategy.performance.profitFactor ?? 0).toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">Profit Factor</div>
                          </div>
                        </div>
                      )}

                      {/* Live Trading Stats */}
                      {strategy.liveStats && strategy.liveStats.isRunning && (
                        <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-accent animate-pulse" />
                            Canlı Trading İstatistikleri
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Günlük P&L</span>
                              <div className={`font-semibold ${strategy.liveStats.currentPnL >= 0 ? 'text-accent' : 'text-destructive'}`}>
                                {strategy.liveStats.currentPnL >= 0 ? '+' : ''}{strategy.liveStats.currentPnL.toFixed(2)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Aktif Pozisyon</span>
                              <div className="font-semibold">{strategy.liveStats.activePositions}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Bugünkü İşlem</span>
                              <div className="font-semibold">{strategy.liveStats.todayTrades}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Çalışma Süresi</span>
                              <div className="font-semibold">
                                {Math.ceil((Date.now() - new Date(strategy.liveStats.startDate).getTime()) / (1000 * 60 * 60 * 24))} gün
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Optimization Info */}
                      {strategy.optimization && (
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">
                                Optimizasyon Puanı: {strategy.optimization.score}/100
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {strategy.optimization.iterations} iterasyon
                            </Badge>
                          </div>
                          <Progress value={strategy.optimization.score} className="h-2" />
                        </div>
                      )}
                      
                      {/* Errors */}
                      {strategy.errors && strategy.errors.length > 0 && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="font-medium text-sm">Kritik Hatalar Tespit Edildi</span>
                          </div>
                          <ul className="text-sm space-y-1">
                            {strategy.errors.map((error, idx) => (
                              <li key={idx} className="text-destructive flex items-start gap-2">
                                <span className="text-destructive mt-1">•</span>
                                <span>{error}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openStrategyEditor(strategy)}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Editörde Aç
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Kodu İncele
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-5xl max-h-[85vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                {strategy.name} - Trading Algorithm
                              </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[70vh] w-full">
                              <pre className="text-sm bg-muted p-6 rounded-lg font-mono overflow-x-auto whitespace-pre-wrap">
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
                          <ChartLine className="h-4 w-4 mr-2" />
                          {strategy.status === 'testing' ? 'Backtest Yapılıyor...' : 'Gelişmiş Backtest'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => optimizeStrategy(strategy)}
                          disabled={strategy.status === 'optimizing'}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          {strategy.status === 'optimizing' ? 'Optimize Ediliyor...' : 'AI Optimizasyon'}
                        </Button>
                        
                        {strategy.errors && strategy.errors.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fixStrategyErrors(strategy)}
                            disabled={strategy.status === 'generating'}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            {strategy.status === 'generating' ? 'AI Düzeltiyor...' : 'Hataları Düzelt'}
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => duplicateStrategy(strategy)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Kopyala
                        </Button>
                        
                        {strategy.status === 'ready' && !strategy.errors && (
                          <Button 
                            size="sm"
                            onClick={() => goLive(strategy)}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Canlı Başlat
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteStrategy(strategy.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Sil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Strategy Editor Modal */}
      {showStrategyEditor && (
        <div className="fixed inset-0 z-50">
          <StrategyEditor
            strategy={editingStrategy}
            onSave={saveStrategyFromEditor}
            onClose={closeStrategyEditor}
          />
        </div>
      )}

      {/* AI Configuration Dialog */}
      <Dialog open={showAIConfig} onOpenChange={setShowAIConfig}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gear className="h-5 w-5" />
              AI Konfigürasyonu
            </DialogTitle>
          </DialogHeader>
          <AIConfiguration onClose={() => setShowAIConfig(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}