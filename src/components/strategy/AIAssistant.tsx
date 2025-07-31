import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { ScrollArea } from '../ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { TradingStrategy } from '../../types/trading'
import { aiService } from '../../services/aiService'
import { 
  Bot, 
  PaperPlaneRight, 
  CircleNotch, 
  Lightbulb, 
  Code, 
  Gear, 
  TrendingUp,
  X,
  ChatCircle,
  Question,
  Wrench
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: 'code_generated' | 'code_optimized' | 'error_fixed' | 'explanation'
}

interface AIAssistantProps {
  strategy: TradingStrategy
  onUpdateStrategy: (strategy: TradingStrategy) => void
  onClose: () => void
}

export function AIAssistant({ strategy, onUpdateStrategy, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Merhaba! Ben AI asistanınızım. ${strategy.name} stratejinizle ilgili size nasıl yardımcı olabilirim?

**Yapabileceklerim:**
• Kod açıklama ve analiz
• Hataları tespit edip düzeltme  
• Performans optimizasyonu
• Yeni özellik ekleme
• Trading mantığı önerileri

Bir soru sorun veya yardım isteyin!`,
      timestamp: new Date()
    }
  ])
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    {
      icon: <Code className="h-4 w-4" />,
      label: 'Kodu Açıkla',
      action: 'Bu strateji kodunu detaylı olarak açıkla. Ne yapıyor ve nasıl çalışıyor?'
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: 'Performans Analizi',
      action: 'Bu stratejinin performansını analiz et ve iyileştirme önerileri sun.'
    },
    {
      icon: <Wrench className="h-4 w-4" />,
      label: 'Kod Optimize Et',
      action: 'Bu strateji kodunu optimize et. Daha verimli hale getir.'
    },
    {
      icon: <Gear className="h-4 w-4" />,
      label: 'Risk Yönetimi Ekle',
      action: 'Bu stratejiye stop loss ve take profit özellikleri ekle.'
    }
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim()
    if (!content) return

    if (!aiService.isConfigured()) {
      toast.error('AI servisi yapılandırılmamış. API anahtarınızı ayarlayın.')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let aiResponse = ''
      let action: Message['action'] | undefined

      // Determine the type of request and call appropriate AI method
      if (content.toLowerCase().includes('açıkla') || content.toLowerCase().includes('analiz')) {
        aiResponse = await aiService.explainCode(strategy.code)
        action = 'explanation'
      } else if (content.toLowerCase().includes('optimize') || content.toLowerCase().includes('iyileştir')) {
        aiResponse = await aiService.optimizeCode(strategy.code)
        action = 'code_optimized'
        
        // Try to extract optimized code and update strategy
        const codeMatch = aiResponse.match(/```(?:c#|csharp)?\n?([\s\S]*?)\n?```/i)
        if (codeMatch) {
          const optimizedCode = codeMatch[1].trim()
          onUpdateStrategy({
            ...strategy,
            code: optimizedCode,
            lastModified: new Date().toISOString()
          })
          toast.success('Kod optimize edildi ve güncellendi!')
        }
      } else if (content.toLowerCase().includes('hata') || content.toLowerCase().includes('düzelt')) {
        const errorContext = strategy.errors?.join('; ') || 'Kod analizi ve genel hata kontrolü'
        aiResponse = await aiService.fixCode(strategy.code, errorContext)
        action = 'error_fixed'
        
        // Try to extract fixed code and update strategy
        const codeMatch = aiResponse.match(/```(?:c#|csharp)?\n?([\s\S]*?)\n?```/i)
        if (codeMatch) {
          const fixedCode = codeMatch[1].trim()
          onUpdateStrategy({
            ...strategy,
            code: fixedCode,
            errors: [],
            lastModified: new Date().toISOString()
          })
          toast.success('Kod düzeltildi ve güncellendi!')
        }
      } else {
        // General conversation with context
        const contextPrompt = `
Kullanıcının şu trading stratejisi var:
Strateji Adı: ${strategy.name}
Açıklama: ${strategy.description}

Kod:
${strategy.code}

Kullanıcı sorusu: ${content}

Lütfen Türkçe olarak yardımcı ol ve stratejiye özel tavsiyelerde bulun.`

        aiResponse = await aiService.generateCode(contextPrompt)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        action
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('AI Assistant error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Üzgünüm, bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}

API ayarlarınızı kontrol edin veya daha sonra tekrar deneyin.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('AI yanıt veremedi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    sendMessage(action)
  }

  return (
    <div className="h-full flex flex-col bg-card border-l">
      {/* Header */}
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Asistan</h3>
              <p className="text-xs text-muted-foreground">MatrixIQ GPT Agent</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b bg-muted/30">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="h-auto p-2 text-xs"
              onClick={() => handleQuickAction(action.action)}
              disabled={isLoading}
            >
              <div className="flex flex-col items-center gap-1">
                {action.icon}
                <span className="text-center leading-tight">{action.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium">AI Asistan</span>
                    {message.action && (
                      <Badge variant="outline" className="text-xs">
                        {message.action === 'code_generated' && 'Kod Üretildi'}
                        {message.action === 'code_optimized' && 'Optimize Edildi'}
                        {message.action === 'error_fixed' && 'Hata Düzeltildi'}
                        {message.action === 'explanation' && 'Açıklama'}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <CircleNotch className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm">AI düşünüyor...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AI asistana mesaj yazın..."
            className="min-h-[40px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="px-3"
          >
            <PaperPlaneRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Enter ile gönder, Shift+Enter ile yeni satır</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>AI Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}