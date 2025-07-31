import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { StrategyTemplates } from './StrategyTemplates'
import { AIAssistant } from './AIAssistant'
import { Play, Square, Settings, TrendingUp, Activity, BookOpen, Bot, Save, X, Code2, FileText, Lightbulb } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TradingStrategy {
  id: string
  name: string
  description: string
  code: string
  language: 'csharp' | 'python'
  category: 'scalping' | 'grid' | 'trend' | 'breakout' | 'mean_reversion' | 'custom'
  indicators: string[]
  parameters: Record<string, number>
  status: 'draft' | 'generating' | 'testing' | 'optimizing' | 'ready' | 'live' | 'paused' | 'error'
  createdAt: string
  lastModified: string
  performance?: {
    totalReturn: number
    sharpeRatio: number
    winRate: number
    maxDrawdown: number
    totalTrades: number
  }
}

interface StrategyEditorProps {
  strategy?: TradingStrategy | null
  onSave: (strategy: TradingStrategy) => void
  onClose: () => void
}

const defaultStrategy: Partial<TradingStrategy> = {
  name: 'Yeni Strateji',
  description: 'AI ile oluşturulan yeni trading stratejisi',
  code: `using System;
using MatriksIQ.API;

public class NewStrategy : Strategy
{
    // Strateji parametreleri
    private double threshold = 0.7;
    private int period = 14;
    
    // İndikatörler
    private RSI rsi;
    private SMA sma;
    
    public override void OnStart()
    {
        rsi = RSI(period);
        sma = SMA(20);
    }
    
    public override void OnBarUpdate()
    {
        // Strateji mantığı burada yer alacak
        if (rsi.Value > 70)
        {
            // Satış sinyali
            Sell();
        }
        else if (rsi.Value < 30)
        {
            // Alış sinyali
            Buy();
        }
    }
}`,
  language: 'csharp',
  category: 'custom',
  indicators: ['RSI', 'SMA'],
  parameters: { period: 14, threshold: 0.7 },
  status: 'draft'
}

export function StrategyEditor({ strategy, onSave, onClose }: StrategyEditorProps) {
  const [currentStrategy, setCurrentStrategy] = useState<TradingStrategy>(() => ({
    id: strategy?.id || Date.now().toString(),
    ...defaultStrategy,
    ...strategy,
    createdAt: strategy?.createdAt || new Date().toISOString(),
    lastModified: new Date().toISOString()
  } as TradingStrategy))

  const [isRunning, setIsRunning] = useState(false)
  const [showAssistant, setShowAssistant] = useState(true)

  const handleSave = () => {
    const updatedStrategy = {
      ...currentStrategy,
      lastModified: new Date().toISOString()
    }
    setCurrentStrategy(updatedStrategy)
    onSave(updatedStrategy)
    toast.success('Strateji kaydedildi')
  }

  const handleRunStrategy = () => {
    if (isRunning) {
      setIsRunning(false)
      setCurrentStrategy(prev => ({ ...prev, status: 'paused' }))
      toast.info('Strateji durduruldu')
    } else {
      setIsRunning(true)
      setCurrentStrategy(prev => ({ ...prev, status: 'live' }))
      toast.success('Strateji çalıştırıldı')
    }
  }

  const handleBacktest = () => {
    setCurrentStrategy(prev => ({ ...prev, status: 'testing' }))
    toast.info('Backtest başlatıldı...')
    
    // Simulate backtest
    setTimeout(() => {
      setCurrentStrategy(prev => ({
        ...prev,
        status: 'ready',
        performance: {
          totalReturn: 15.3,
          sharpeRatio: 1.4,
          winRate: 65.2,
          maxDrawdown: -8.2,
          totalTrades: 125
        }
      }))
      toast.success('Backtest tamamlandı')
    }, 3000)
  }

  const handleOptimize = () => {
    setCurrentStrategy(prev => ({ ...prev, status: 'optimizing' }))
    toast.info('Optimizasyon başlatıldı...')
    
    setTimeout(() => {
      setCurrentStrategy(prev => ({ 
        ...prev, 
        status: 'ready',
        parameters: { ...prev.parameters, period: 12, threshold: 0.65 }
      }))
      toast.success('Optimizasyon tamamlandı - En iyi parametreler bulundu')
    }, 5000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500'
      case 'testing': return 'bg-blue-500'
      case 'optimizing': return 'bg-purple-500'
      case 'ready': return 'bg-emerald-500'
      case 'paused': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'Canlı'
      case 'testing': return 'Test Ediliyor'
      case 'optimizing': return 'Optimize Ediliyor'
      case 'ready': return 'Hazır'
      case 'paused': return 'Duraklatıldı'
      case 'error': return 'Hata'
      default: return 'Taslak'
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Strateji Editörü</h1>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <Input
              value={currentStrategy.name}
              onChange={(e) => setCurrentStrategy(prev => ({ ...prev, name: e.target.value }))}
              className="w-48 h-8"
            />
            <Badge className={`${getStatusColor(currentStrategy.status)} text-white`}>
              {getStatusText(currentStrategy.status)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAssistant(!showAssistant)}
          >
            <Bot className="w-4 h-4 mr-1" />
            AI Asistan
          </Button>
          <Button variant="outline" size="sm" onClick={handleBacktest} disabled={currentStrategy.status === 'testing'}>
            <TrendingUp className="w-4 h-4 mr-1" />
            Backtest
          </Button>
          <Button variant="outline" size="sm" onClick={handleOptimize} disabled={currentStrategy.status === 'optimizing'}>
            <Settings className="w-4 h-4 mr-1" />
            Optimize Et
          </Button>
          <Button
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            onClick={handleRunStrategy}
          >
            {isRunning ? <Square className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isRunning ? 'Durdur' : 'Çalıştır'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Kaydet
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Strategy Explorer */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full border-r bg-card">
              <Tabs defaultValue="templates" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="templates" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Şablonlar
                  </TabsTrigger>
                  <TabsTrigger value="indicators" className="text-xs">
                    <Activity className="w-3 h-3 mr-1" />
                    İndikatörler
                  </TabsTrigger>
                  <TabsTrigger value="help" className="text-xs">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Yardım
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="h-full p-0">
                  <StrategyTemplates 
                    onSelectTemplate={(template) => {
                      setCurrentStrategy(prev => ({
                        ...prev,
                        code: template.code,
                        category: template.category,
                        indicators: template.indicators,
                        parameters: template.parameters
                      }))
                      toast.success('Şablon yüklendi')
                    }}
                  />
                </TabsContent>

                <TabsContent value="indicators" className="h-full p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Popüler İndikatörler</h3>
                    <div className="grid grid-cols-1 gap-1">
                      {['RSI', 'MACD', 'SMA', 'EMA', 'Bollinger Bands', 'Stochastic'].map((indicator) => (
                        <Button
                          key={indicator}
                          variant="ghost"
                          size="sm"
                          className="justify-start h-8 text-xs"
                          onClick={() => {
                            // Add indicator to code
                            toast.info(`${indicator} eklendi`)
                          }}
                        >
                          {indicator}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="help" className="h-full p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm mb-2">Hızlı Başlangıç</h3>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Sol panelden şablon seçin</li>
                        <li>• AI asistanından yardım alın</li>
                        <li>• Kodu düzenleyin</li>
                        <li>• Backtest yapın</li>
                        <li>• Optimize edin</li>
                        <li>• Canlı çalıştırın</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Code Editor */}
          <ResizablePanel defaultSize={showAssistant ? 50 : 80} minSize={40}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-sm font-medium">Strateji Kodu ({currentStrategy.language})</Label>
                  <Badge variant="outline" className="text-xs">
                    {currentStrategy.indicators.join(', ')}
                  </Badge>
                </div>
                <Textarea
                  value={currentStrategy.code}
                  onChange={(e) => setCurrentStrategy(prev => ({ ...prev, code: e.target.value }))}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Strateji kodunuzu buraya yazın..."
                />
              </div>

              {/* Performance Metrics */}
              {currentStrategy.performance && (
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-medium text-sm mb-2">Backtest Sonuçları</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {currentStrategy.performance.totalReturn}%
                      </div>
                      <div className="text-xs text-muted-foreground">Toplam Getiri</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {currentStrategy.performance.sharpeRatio}
                      </div>
                      <div className="text-xs text-muted-foreground">Sharpe Oranı</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {currentStrategy.performance.winRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Kazanma Oranı</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">
                        {currentStrategy.performance.maxDrawdown}%
                      </div>
                      <div className="text-xs text-muted-foreground">Max Drawdown</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {currentStrategy.performance.totalTrades}
                      </div>
                      <div className="text-xs text-muted-foreground">Toplam İşlem</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          {/* Right Panel - AI Assistant */}
          {showAssistant && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} minSize={25}>
                <AIAssistant
                  strategy={currentStrategy}
                  onStrategyUpdate={setCurrentStrategy}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}