import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Textarea } from '../ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Progress } from '../ui/progress'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { highlightCode, formatCode } from './syntaxHighlighter'
import { aiService } from '../../services/aiService'
import { APISettings } from '../../types/api'
import {
  Play, Bot, Code, Settings, Sparkle, Brain, Lightning, Cpu, 
  Activity, Save, RotateCcw, FileText, Terminal, Zap, 
  CircleNotch, CheckCircle, AlertTriangle, Copy, Download,
  ArrowRight, X, Minimize2, Maximize2, Search, Replace,
  MessageSquare, Send, User, Calendar, Clock, Target
} from '@phosphor-icons/react'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    action?: string
    progress?: number
    status?: string
  }
}

interface TradingStrategy {
  id: string
  name: string
  description: string
  code: string
  indicators: any[]
  parameters: Record<string, number>
  status: 'draft' | 'generating' | 'testing' | 'optimizing' | 'ready' | 'live' | 'paused' | 'error'
  createdAt: string
  lastModified: string
  errors?: string[]
  performance?: any
}

interface CodeEditorProps {
  strategy?: TradingStrategy | null
  onSave: (strategy: TradingStrategy) => void
  onClose: () => void
  onChange?: (code: string) => void
}

export function CodeEditor({ strategy, onSave, onClose, onChange }: CodeEditorProps) {
  const [apiSettings] = useKV<APISettings>('api-settings', {
    openai: { apiKey: '', model: 'gpt-4', enabled: true },
    anthropic: { apiKey: '', model: 'claude-3-sonnet', enabled: false },
    binance: { apiKey: '', secretKey: '', testnet: true, enabled: false }
  })

  const [code, setCode] = useState(strategy?.code || `using System;
using System.Collections.Generic;
using MatriksIQ.API;

public class NewTradingStrategy : Strategy
{
    // Strateji parametreleri
    private int rsiPeriod = 14;
    private double oversoldLevel = 30;
    private double overboughtLevel = 70;
    private double stopLoss = 1.0; // %1
    private double takeProfit = 2.0; // %2
    
    // İndikatörler
    private RSI rsi;
    private EMA emaFast;
    private EMA emaSlow;
    
    public override void OnStart()
    {
        // İndikatörleri başlat
        rsi = RSI(rsiPeriod);
        emaFast = EMA(9);
        emaSlow = EMA(21);
        
        Print("Strateji başlatıldı: " + Instrument.MasterInstrument.Name);
    }
    
    public override void OnBarUpdate()
    {
        // Yeterli bar kontrolü
        if (Bars.Count < Math.Max(rsiPeriod, 21)) return;
        
        // Trend belirleme
        bool upTrend = emaFast.Value > emaSlow.Value;
        bool downTrend = emaFast.Value < emaSlow.Value;
        
        // Long pozisyon girişi
        if (rsi.Value < oversoldLevel && 
            upTrend && 
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterLong();
            SetStopLoss(CalculationMode.Percent, stopLoss);
            SetProfitTarget(CalculationMode.Percent, takeProfit);
            
            Print($"Long pozisyon açıldı - RSI: {rsi.Value:F2}");
        }
        
        // Short pozisyon girişi  
        if (rsi.Value > overboughtLevel && 
            downTrend && 
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterShort();
            SetStopLoss(CalculationMode.Percent, stopLoss);
            SetProfitTarget(CalculationMode.Percent, takeProfit);
            
            Print($"Short pozisyon açıldı - RSI: {rsi.Value:F2}");
        }
    }
    
    public override void OnPositionUpdate(Position position)
    {
        // Pozisyon güncellemeleri
        Print($"Pozisyon güncellendi: {position.MarketPosition} - P&L: {position.GetUnrealizedProfitLoss()}");
    }
    
    public override void OnOrderUpdate(Order order)
    {
        // Emir güncellemeleri
        if (order.OrderState == OrderState.Filled)
        {
            Print($"Emir gerçekleşti: {order.OrderAction} - Fiyat: {order.AverageFillPrice}");
        }
    }
}`)
  
  const [fileName, setFileName] = useState(strategy?.name ? `${strategy.name}.cs` : 'NewTradingStrategy.cs')
  const [isModified, setIsModified] = useState(false)
  const [chatMessages, setChatMessages] = useKV<ChatMessage[]>('code-editor-chat', [])
  const [chatInput, setChatInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentLine, setCurrentLine] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rightPanelWidth, setRightPanelWidth] = useState(400)
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [showSearchReplace, setShowSearchReplace] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  // Initialize AI service with current settings
  useEffect(() => {
    aiService.setSettings(apiSettings)
  }, [apiSettings])

  const addChatMessage = (type: ChatMessage['type'], content: string, metadata?: ChatMessage['metadata']) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date().toISOString(),
      metadata
    }
    setChatMessages(current => [...current, newMessage])
  }

  const handleCodeChange = (value: string) => {
    setCode(value)
    setIsModified(true)
    onChange?.(value)
    
    // Update line numbers
    const lines = value.split('\n').length
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart
      const beforeCursor = value.substring(0, cursorPosition)
      const currentLine = beforeCursor.split('\n').length
      setCurrentLine(currentLine)
    }
  }

  const handleSave = () => {
    // fileName'in undefined olmaması için güvenli erişim sağla
    const safeName = fileName || 'NewTradingStrategy.cs'
    
    const updatedStrategy: TradingStrategy = {
      id: strategy?.id || Date.now().toString(),
      name: safeName.replace('.cs', '').replace('.js', '').replace('.py', ''),
      description: strategy?.description || 'AI ile oluşturulan trading stratejisi',
      code,
      indicators: strategy?.indicators || [],
      parameters: strategy?.parameters || {},
      status: 'draft',
      createdAt: strategy?.createdAt || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      errors: strategy?.errors
    }
    
    onSave(updatedStrategy)
    setIsModified(false)
    toast.success('💾 Strateji kaydedildi!')
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    // Check if AI is configured
    const openaiConfigured = apiSettings.openai?.enabled && apiSettings.openai?.apiKey?.trim()
    const anthropicConfigured = apiSettings.anthropic?.enabled && apiSettings.anthropic?.apiKey?.trim()
    
    if (!openaiConfigured && !anthropicConfigured) {
      toast.error('AI servisi yapılandırılmamış. Lütfen ayarlardan API anahtarınızı girin.')
      addChatMessage('system', '❌ AI servisi bağlı değil. API ayarlarını kontrol edin.')
      return
    }

    const userMessage = chatInput.trim()
    setChatInput('')
    setIsProcessing(true)

    // Add user message
    addChatMessage('user', userMessage)

    try {
      // Create a comprehensive prompt for the AI
      const fullPrompt = `Sen bir MatrixIQ seviyesinde trading strateji asistanısın. Kullanıcının C# trading stratejisi kod editöründe yardım istiyor.

Mevcut kod:
\`\`\`csharp
${code}
\`\`\`

Dosya adı: ${fileName}
Satır: ${currentLine}

Kullanıcı mesajı: "${userMessage}"

Lütfen:
1. Kodla ilgili sorularını yanıtla
2. Hataları tespit et ve düzelt  
3. İyileştirme önerileri sun
4. Yeni kod parçaları öner
5. Strateji mantığını açıkla
6. MatrixIQ/NinjaTrader API'lerini doğru kullan

Türkçe yanıt ver ve kısa, net açıklamalar yap.`

      // Use the AI service to generate response
      const aiResponse = await aiService.generateCode(fullPrompt)
      
      // Add AI response
      addChatMessage('assistant', aiResponse)
      
      // If response contains code improvements, offer to apply them
      if (aiResponse.includes('```') || aiResponse.toLowerCase().includes('kod') || aiResponse.toLowerCase().includes('düzelt')) {
        addChatMessage('system', '💡 AI kod iyileştirmesi tespit edildi. Değişiklikleri uygulamak ister misiniz?', {
          action: 'apply_suggestion'
        })
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      addChatMessage('system', `❌ AI yanıt verirken hata oluştu: ${errorMessage}`)
      console.error('AI chat error:', error)
      toast.error(`AI chat hatası: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const applyAISuggestion = async () => {
    setIsProcessing(true)
    
    try {
      const improvePrompt = spark.llmPrompt`Bu C# trading stratejisi kodunu geliştir ve düzelt:

\`\`\`csharp
${code}
\`\`\`

Sadece düzeltilmiş C# kodunu döndür, açıklama ekleme:`

      const improvedCode = await spark.llm(improvePrompt, selectedModel)
      
      // Extract code from response if wrapped in markdown
      const codeMatch = improvedCode.match(/```(?:csharp|cs|c#)?\n([\s\S]*?)\n```/)
      const newCode = codeMatch ? codeMatch[1] : improvedCode
      
      setCode(newCode)
      setIsModified(true)
      
      addChatMessage('assistant', '✅ Kod iyileştirmeleri uygulandı! Değişiklikleri inceleyip kaydedebilirsiniz.')
      toast.success('🚀 AI iyileştirmeleri uygulandı!')
      
    } catch (error) {
      addChatMessage('system', '❌ Kod iyileştirme sırasında hata oluştu.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCodeAction = () => {
    const formatted = formatCode(code)
    setCode(formatted)
    setIsModified(true)
    toast.success('📐 Kod formatlandı!')
  }

  const findAndReplace = () => {
    if (!searchQuery) return
    
    const newCode = code.replaceAll(searchQuery, replaceQuery)
    const replacements = (code.match(new RegExp(searchQuery, 'g')) || []).length
    
    if (replacements > 0) {
      setCode(newCode)
      setIsModified(true)
      toast.success(`🔍 ${replacements} değişiklik yapıldı`)
    } else {
      toast.error('🔍 Aranan metin bulunamadı')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    toast.success('📋 Kod panoya kopyalandı!')
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
    toast.success('💾 Kod indirildi!')
  }

  // Line numbers for code editor
  const lineNumbers = code.split('\n').map((_, index) => index + 1)

  return (
    <div className={`h-screen bg-background text-foreground flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* VS Code style header */}
      <div className="h-12 bg-muted border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-accent"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="h-7 text-sm bg-transparent border-none focus:ring-0 min-w-48"
            />
            {isModified && <div className="w-2 h-2 bg-accent rounded-full"></div>}
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code className="h-4 w-4" />
            <span>NewTradingStrategy.cs</span>
            <span>•</span>
            <span>Satır {currentLine}</span>
            <span>•</span>
            <span>{code.split('\n').length} satır</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            CursorGPT IDE
          </Badge>
          
          <Button variant="ghost" size="sm" onClick={() => setShowSearchReplace(!showSearchReplace)}>
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search/Replace Bar */}
      {showSearchReplace && (
        <div className="bg-muted border-b p-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <Replace className="h-4 w-4" />
            <Input
              placeholder="Değiştir..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="w-48"
            />
            <Button size="sm" onClick={findAndReplace}>
              Değiştir
            </Button>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-card" style={{ width: `calc(100% - ${rightPanelWidth}px)` }}>
          {/* Editor Toolbar */}
          <div className="h-10 bg-muted/50 border-b flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                C# • Trading Algorithm
              </Badge>
              <Badge variant="outline" className="text-xs">
                {code.split('\n').length} lines
              </Badge>
              {isModified && (
                <Badge variant="outline" className="text-xs text-accent">
                  • Değiştirildi
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={formatCodeAction}>
                <Settings className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadCode}>
                <Download className="h-3 w-3" />
              </Button>
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Button size="sm" onClick={handleSave} disabled={!isModified}>
                <Save className="h-3 w-3 mr-1" />
                Kaydet
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex overflow-hidden" ref={editorContainerRef}>
            {/* Line Numbers */}
            <div className="w-12 bg-muted/30 border-r flex-shrink-0 p-2 text-xs text-muted-foreground font-mono">
              {lineNumbers.map((lineNum) => (
                <div
                  key={lineNum}
                  className={`text-right leading-6 px-1 ${
                    lineNum === currentLine ? 'bg-primary/20 text-primary' : ''
                  }`}
                >
                  {lineNum}
                </div>
              ))}
            </div>

            {/* Code Input with Syntax Highlighting */}
            <div className="flex-1 relative bg-[#1e1e1e] text-white">
              {/* Syntax highlighted display */}
              <pre className="absolute inset-0 p-4 font-mono text-sm leading-6 overflow-auto whitespace-pre-wrap pointer-events-none z-10">
                <code 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightCode(code, 'csharp') 
                  }}
                />
              </pre>
              
              {/* Invisible textarea for input */}
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="absolute inset-0 w-full h-full resize-none border-none bg-transparent text-transparent caret-white font-mono text-sm leading-6 p-4 focus:ring-0 focus:outline-none selection:bg-blue-500/30"
                style={{ minHeight: '100%' }}
                spellCheck={false}
                onSelect={() => {
                  if (textareaRef.current) {
                    const cursorPosition = textareaRef.current.selectionStart
                    const beforeCursor = code.substring(0, cursorPosition)
                    const currentLine = beforeCursor.split('\n').length
                    setCurrentLine(currentLine)
                  }
                }}
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-6 bg-primary text-primary-foreground flex items-center justify-between px-4 text-xs">
            <div className="flex items-center gap-4">
              <span>✓ MatrixIQ Trading Strateji Editörü hazır</span>
              <span>•</span>
              <span>Spaces: 4</span>
              <span>•</span>
              <span>UTF-8</span>
              <span>•</span>
              <span>C#</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Satır {currentLine}, Sütun 1</span>
            </div>
          </div>
        </div>

        {/* Resizer */}
        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-col-resize"
          onMouseDown={(e) => {
            const startX = e.clientX
            const startWidth = rightPanelWidth

            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = Math.max(300, Math.min(800, startWidth + (startX - e.clientX)))
              setRightPanelWidth(newWidth)
            }

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }

            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        />

        {/* Right Panel - AI Chat */}
        <div className="bg-muted/30 border-l flex flex-col" style={{ width: rightPanelWidth }}>
          {/* Chat Header */}
          <div className="h-12 border-b bg-card px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <MessageSquare className="h-4 w-4 text-primary" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              </div>
              <span className="font-medium text-sm">MatrixIQ AI Chat</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {selectedModel === 'gpt-4o' ? 'GPT-4o Pro' : 'GPT-4o Mini'}
            </Badge>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Welcome Message */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                    <p className="font-medium">🚀 MatrixIQ AI Hazır!</p>
                    <p className="text-muted-foreground mt-1">
                      C# trading stratejinizle ilgili sorularınızı sorun, hataları düzeltin, yeni özellikler ekleyin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat History */}
              {chatMessages.map((message) => (
                <div key={message.id} className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-accent/10' 
                      : message.type === 'assistant' 
                      ? 'bg-primary/10' 
                      : 'bg-secondary/10'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-3 w-3 text-accent" />
                    ) : message.type === 'assistant' ? (
                      <Bot className="h-3 w-3 text-primary" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`p-3 rounded-lg border text-sm ${
                      message.type === 'user'
                        ? 'bg-accent/5 border-accent/20'
                        : message.type === 'assistant'
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-secondary/5 border-secondary/20'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {message.type === 'user' ? 'You' : message.type === 'assistant' ? 'MatrixIQ AI' : 'System'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString('tr-TR')}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      
                      {/* Action Button for AI Suggestions */}
                      {message.metadata?.action === 'apply_suggestion' && (
                        <Button 
                          size="sm" 
                          className="mt-2 h-7 text-xs"
                          onClick={applyAISuggestion}
                          disabled={isProcessing}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Değişiklikleri Uygula
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CircleNotch className="h-3 w-3 text-primary animate-spin" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CircleNotch className="h-3 w-3 animate-spin" />
                        <span className="text-muted-foreground">MatrixIQ AI düşünüyor...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t p-3 bg-card">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  placeholder="MatrixIQ AI'ya strateji hakkında soru sorun... örn: 'Bu kodda hata var mı?' veya 'RSI stratejisi ekle'"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault()
                      sendChatMessage()
                    }
                  }}
                  className="resize-none min-h-[60px] text-sm"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {chatInput.length}/1000
                  </Badge>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={sendChatMessage}
                disabled={isProcessing || !chatInput.trim()}
                className="h-fit"
              >
                {isProcessing ? (
                  <CircleNotch className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}