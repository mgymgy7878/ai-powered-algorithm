import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { CodeEditor } from './CodeEditor'
import { AIAssistant } from './AIAssistant'
import { IndicatorLibrary } from './IndicatorLibrary'
import { StrategyTemplates } from './StrategyTemplates'
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
  errors?: string[]
  performance?: {
    totalReturn: number
    sharpeRatio: number
    maxDrawdown: number
    winRate: number
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
using System.Collections.Generic;
using MatriksIQ.API;

public class NewStrategy : Strategy
{
    // Strateji parametreleri
    private int period = 14;
    private double threshold = 0.7;
    
    // İndikatörler
    private RSI rsi;
    private SMA sma;
    
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
    
    public override void OnStart()
    {
        rsi = RSI(period);
        sma = SMA(20);
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
          maxDrawdown: -8.2,
          winRate: 68.5,
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
                  <TabsTrigger value="examples" className="text-xs">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Örnekler
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="templates" className="h-full p-0">
                  <StrategyTemplates onSelectTemplate={(template) => {
                    setCurrentStrategy(prev => ({
                      ...prev,
                      code: template.code,
                      indicators: template.indicators,
                      category: template.category as any
                    }))
                  }} />
                </TabsContent>
                
                <TabsContent value="indicators" className="h-full p-0">
                  <IndicatorLibrary onSelectIndicator={(indicator) => {
                    // Add indicator to current strategy
                    setCurrentStrategy(prev => ({
                      ...prev,
                      indicators: [...new Set([...prev.indicators, indicator.name])]
                    }))
                  }} />
                </TabsContent>
                
                <TabsContent value="examples" className="h-full p-2">
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      <Card className="p-3 cursor-pointer hover:bg-accent transition-colors">
                        <h4 className="font-medium text-sm">RSI Scalping</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          RSI tabanlı hızlı scalping stratejisi
                        </p>
                      </Card>
                      <Card className="p-3 cursor-pointer hover:bg-accent transition-colors">
                        <h4 className="font-medium text-sm">Grid Bot</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Yatay piyasa için grid bot stratejisi
                        </p>
                      </Card>
                      <Card className="p-3 cursor-pointer hover:bg-accent transition-colors">
                        <h4 className="font-medium text-sm">Breakout Strategy</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Seviye kırılımı takip stratejisi
                        </p>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Code Editor */}
          <ResizablePanel defaultSize={showAssistant ? 50 : 80} minSize={40}>
            <CodeEditor
              strategy={currentStrategy}
              onSave={handleSave}
              onClose={onClose}
              onChange={(code) => setCurrentStrategy(prev => ({ ...prev, code }))}
            />
          </ResizablePanel>

          {showAssistant && (
            <>
              <ResizableHandle />
              {/* Right Panel - AI Assistant */}
              <ResizablePanel defaultSize={30} minSize={25}>
                <AIAssistant
                  strategy={currentStrategy}
                  onUpdateStrategy={setCurrentStrategy}
                  onClose={() => setShowAssistant(false)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Bottom Panel - Strategy Info & Performance */}
      {currentStrategy.performance && (
        <div className="border-t bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Backtest Sonuçları</h3>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Toplam Getiri:</span>
                <span className={`font-medium ${currentStrategy.performance.totalReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  %{currentStrategy.performance.totalReturn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Sharpe Oranı:</span>
                <span className="font-medium">{currentStrategy.performance.sharpeRatio}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Max Düşüş:</span>
                <span className="font-medium text-red-600">%{currentStrategy.performance.maxDrawdown}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Kazanma Oranı:</span>
                <span className="font-medium">%{currentStrategy.performance.winRate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Toplam İşlem:</span>
                <span className="font-medium">{currentStrategy.performance.totalTrades}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}