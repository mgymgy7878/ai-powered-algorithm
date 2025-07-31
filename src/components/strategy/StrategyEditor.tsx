import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/se
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { StrategyTemplates } from './StrategyTemplates'
import { toast } from 'sonner'
interface TradingStrategy {
  name: string
  code: string
  category: 'scalping' | 'grid' | 'trend'
  parameters: Record<string, number>
  createdAt: string
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
    
  performance?: {
        if (rsi.Value >
    sharpeRatio: number
        }
    winRate: number
    totalTrades: number
   
 

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
 
    // Strateji parametreleri
    if (isRunning) {
    private double threshold = 0.7;
    
    // İndikatörler
    }
    private SMA sma;
    
    public override void OnBarUpdate()
    s
        // Strateji mantığı burada yer alacak
        if (rsi.Value > 70)
        {
            // Satış sinyali
            Sell();
      toa
        else if (rsi.Value < 30)
  const h
            // Alış sinyali
    setTimeout(() 
        }
     
    
    public override void OnStart()
    {
        rsi = RSI(period);
        sma = SMA(20);
    }
}`,
  }
  category: 'custom',
      case 'live': return 'Ca
  parameters: { period: 14, threshold: 0.7 },
      case 'pause
 

export function StrategyEditor({ strategy, onSave, onClose }: StrategyEditorProps) {
  const [currentStrategy, setCurrentStrategy] = useState<TradingStrategy>(() => ({
    id: strategy?.id || Date.now().toString(),
            <Code2 clas
    ...strategy,
    createdAt: strategy?.createdAt || new Date().toISOString(),
    lastModified: new Date().toISOString()
              className=

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
          </Button>
      setIsRunning(false)
      setCurrentStrategy(prev => ({ ...prev, status: 'paused' }))
      toast.info('Strateji durduruldu')
    } else {
      setIsRunning(true)
      setCurrentStrategy(prev => ({ ...prev, status: 'live' }))
      toast.success('Strateji çalıştırıldı')
     
  }

  const handleBacktest = () => {
    setCurrentStrategy(prev => ({ ...prev, status: 'testing' }))
    toast.info('Backtest başlatıldı...')
    
    // Simulate backtest
    setTimeout(() => {
      setCurrentStrategy(prev => ({
                
        status: 'ready',
                    })
          totalReturn: 15.3,
          sharpeRatio: 1.4,
          maxDrawdown: -8.2,
                      ..
          totalTrades: 125
         
      }))
      toast.success('Backtest tamamlandı')
    }, 3000)
   

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

        </
    <div className="flex flex-col h-screen bg-background">
}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Strateji Editörü</h1>

          <Separator orientation="vertical" className="h-6" />

            <Input

              onChange={(e) => setCurrentStrategy(prev => ({ ...prev, name: e.target.value }))}
              className="w-48 h-8"
            />
            <Badge className={`${getStatusColor(currentStrategy.status)} text-white`}>
              {getStatusText(currentStrategy.status)}

          </div>

        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAssistant(!showAssistant)}
          >
            <Bot className="w-4 h-4 mr-1" />
            AI Asistan

          <Button variant="outline" size="sm" onClick={handleBacktest} disabled={currentStrategy.status === 'testing'}>
            <TrendingUp className="w-4 h-4 mr-1" />
            Backtest

          <Button variant="outline" size="sm" onClick={handleOptimize} disabled={currentStrategy.status === 'optimizing'}>
            <Settings className="w-4 h-4 mr-1" />
            Optimize Et

          <Button
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            onClick={handleRunStrategy}
          >
            {isRunning ? <Square className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isRunning ? 'Durdur' : 'Çalıştır'}

          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Kaydet

          <Button variant="ghost" size="sm" onClick={onClose}>

          </Button>
        </div>
      </div>

      {/* Main Editor Area */}

        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Strategy Explorer */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full border-r bg-card">
              <Tabs defaultValue="templates" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="templates" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Şablonlar

                  <TabsTrigger value="indicators" className="text-xs">
























































































































