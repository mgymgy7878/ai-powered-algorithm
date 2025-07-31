import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Bot, User, PaperPlaneRight, Lightbulb, Code, TrendingUp, X, Sparkle, Gear, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { aiService } from '@/lib/ai-service'
import { AIConfiguration } from '@/components/ai/AIConfiguration'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIAssistantProps {
  strategy: any
  onUpdateStrategy: (updater: (prev: any) => any) => void
  onClose: () => void
}

const quickPrompts = [
  {
    title: "Bu stratejiyi açıkla",
    prompt: "Bu strateji kodunu satır satır açıklar mısın? Nasıl çalıştığını anlatabilir misin?",
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    title: "Hataları düzelt",
    prompt: "Kodumda herhangi bir hata var mı? Varsa nasıl düzeltebilirim?",
    icon: <Code className="w-4 h-4" />
  },
  {
    title: "Performansı iyileştir",
    prompt: "Bu stratejiyi nasıl daha karlı hale getirebilirim? Optimizasyon önerilerin neler?",
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    title: "RSI ekle",
    prompt: "Bu stratejiye RSI indikatörü ekler misin? RSI 70 üstünde satış, 30 altında alış yapsın.",
    icon: <Sparkle className="w-4 h-4" />
  }
]

export function AIAssistant({ strategy, onUpdateStrategy, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Merhaba! Ben sizin AI strateji asistanınızım. Size ${strategy.name} stratejiniz ile ilgili yardımcı olabilirim. 

Yapabileceğim bazı şeyler:
• Strateji kodunu açıklayabilirim
• Hataları tespit edip düzeltebilirim  
• Yeni indikatörler ekleyebilirim
• Kod optimizasyonu yapabilirim
• Backtest sonuçlarını analiz edebilirim

Nasıl yardımcı olmamı istersiniz?`,
      timestamp: new Date(),
      suggestions: [
        "Stratejiyi açıkla",
        "Hataları bul ve düzelt", 
        "MACD indikatörü ekle",
        "Risk yönetimi ekle"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      let response = ''
      let updatedCode = strategy.code

      // Check AI configuration
      const config = aiService.getConfig()
      if (!config.openaiApiKey && !config.anthropicApiKey) {
        throw new Error('AI API anahtarı bulunamadı. Lütfen ayarlardan API anahtarınızı girin.')
      }

      // Determine the type of request and call appropriate AI method
      if (content.toLowerCase().includes('açıkla') || content.toLowerCase().includes('explain')) {
        const aiResponse = await aiService.explainStrategy(strategy.code)
        response = aiResponse.content
      } 
      else if (content.toLowerCase().includes('hata') || content.toLowerCase().includes('error') || content.toLowerCase().includes('düzelt')) {
        const aiResponse = await aiService.findAndFixErrors(strategy.code)
        response = aiResponse.content
        
        // Try to extract improved code if AI provided it
        const codeMatch = response.match(/```c#([\s\S]*?)```/i)
        if (codeMatch) {
          updatedCode = codeMatch[1].trim()
        }
      }
      else if (content.toLowerCase().includes('optimize') || content.toLowerCase().includes('iyileştir') || content.toLowerCase().includes('performans')) {
        const aiResponse = await aiService.optimizeStrategy(strategy.code)
        response = aiResponse.content
        
        // Try to extract optimized code if AI provided it
        const codeMatch = response.match(/```c#([\s\S]*?)```/i)
        if (codeMatch) {
          updatedCode = codeMatch[1].trim()
        }
      }
      else if (content.toLowerCase().includes('rsi') || content.toLowerCase().includes('macd') || 
               content.toLowerCase().includes('sma') || content.toLowerCase().includes('ema') ||
               content.toLowerCase().includes('bollinger') || content.toLowerCase().includes('stoch')) {
        // Extract indicator name
        const indicators = ['RSI', 'MACD', 'SMA', 'EMA', 'Bollinger', 'Stochastic']
        const mentionedIndicator = indicators.find(ind => 
          content.toLowerCase().includes(ind.toLowerCase())
        ) || 'belirtilen indikatör'
        
        const aiResponse = await aiService.addIndicator(strategy.code, mentionedIndicator)
        response = aiResponse.content
        
        // Try to extract updated code if AI provided it
        const codeMatch = response.match(/```c#([\s\S]*?)```/i)
        if (codeMatch) {
          updatedCode = codeMatch[1].trim()
        }
      }
      else {
        // General question
        const aiResponse = await aiService.generalQuestion(content, `Mevcut strateji: ${strategy.name}`)
        response = aiResponse.content
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        suggestions: [
          "Backtest yap",
          "Parametreleri optimize et", 
          "Stop loss ekle",
          "Kodu temizle"
        ]
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update strategy if code was modified
      if (updatedCode !== strategy.code && updatedCode.length > 100) {
        onUpdateStrategy(prev => ({ ...prev, code: updatedCode }))
        toast.success('Strateji kodu AI tarafından güncellendi')
      }

    } catch (error: any) {
      console.error('AI Assistant Error:', error)
      
      let errorMessage = 'AI asistanı ile bağlantı kurulamadı.'
      
      if (error.message.includes('API anahtarı')) {
        errorMessage = error.message + ' AI ayarlarını yapılandırmak için ayarlar butonuna tıklayın.'
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API kullanım limitiniz dolmuş. Lütfen API sağlayıcınızla iletişime geçin.'
      } else if (error.message.includes('invalid')) {
        errorMessage = 'API anahtarınız geçersiz. Lütfen ayarlardan kontrol edin.'
      }
      
      const errorMessage_obj: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ **Hata:** ${errorMessage}

AI özelliklerini kullanmak için:
1. Ayarlar butonuna tıklayın (⚙️)
2. OpenAI veya Anthropic API anahtarınızı girin  
3. "Test Et" butonu ile bağlantıyı doğrulayın
4. Tekrar deneyin

API anahtarları güvenli şekilde tarayıcınızda saklanır.`,
        timestamp: new Date(),
        suggestions: [
          "Ayarları aç",
          "API anahtarı nedir?",
          "Hangi modeli seçmeliyim?",
          "Tekrar dene"
        ]
      }
      
      setMessages(prev => [...prev, errorMessage_obj])
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Ayarları aç") {
      setShowConfig(true)
      return
    }
    sendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border-l">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">AI Strateji Asistanı</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowConfig(true)}
            title="AI Ayarları"
          >
            <Gear className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-2 gap-2">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto p-2 text-left justify-start"
              onClick={() => handleQuickPrompt(prompt.prompt)}
              disabled={isLoading}
            >
              <div className="flex items-start gap-2">
                {prompt.icon}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{prompt.title}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              
              <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                <Card className={`p-3 ${message.type === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  
                  {message.suggestions && message.type === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="text-xs text-muted-foreground mb-2">Önerilen sorular:</div>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-accent text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
                
                <div className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <Card className="p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                  AI düşünüyor...
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="AI asistanına bir soru sorun..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            <PaperPlaneRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          AI asistanı kodunuzu analiz edebilir, hatalarınızı düzeltebilir ve optimizasyon önerileri sunabilir.
        </div>
      </div>

      {/* AI Configuration Dialog */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Konfigürasyonu</DialogTitle>
          </DialogHeader>
          <AIConfiguration onClose={() => setShowConfig(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}