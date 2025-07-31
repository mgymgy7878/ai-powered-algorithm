import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Bot, User, PaperPlaneRight, Lightbulb, Code, TrendingUp, X, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'

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
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500))

      let response = ''
      let updatedCode = strategy.code

      // Simple AI responses based on user input
      if (content.toLowerCase().includes('açıkla') || content.toLowerCase().includes('explain')) {
        response = `Bu strateji şu şekilde çalışıyor:

1. **OnStart()** metodunda RSI ve SMA indikatörleri tanımlanıyor
2. **OnBarUpdate()** her yeni bar geldiğinde çalışıyor
3. RSI değeri 70'in üzerindeyken satış sinyali oluşturuyor
4. RSI değeri 30'un altındayken alış sinyali oluşturuyor

Bu basit bir aşırı alım/aşırı satım stratejisidir. RSI indikatörü momentum değişimlerini yakalamaya çalışır.`

      } else if (content.toLowerCase().includes('hata') || content.toLowerCase().includes('error')) {
        response = `Kodunuzu inceledim ve şu iyileştirmeleri öneriyorum:

1. **Risk Yönetimi Eksik**: Stop loss ve take profit seviyeleriniz yok
2. **Position Size**: Pozisyon büyüklüğü tanımlanmamış
3. **Hata Kontrolü**: İndikatör değerlerinin geçerliliği kontrol edilmiyor

Bu düzeltmeleri yapmak ister misiniz?`

      } else if (content.toLowerCase().includes('rsi') || content.toLowerCase().includes('macd')) {
        const indicator = content.toLowerCase().includes('rsi') ? 'RSI' : 'MACD'
        updatedCode = strategy.code.replace(
          'public override void OnStart()',
          `// ${indicator} indikatörü eklendi
    private ${indicator.toLowerCase()} ${indicator.toLowerCase()};
    
    public override void OnStart()`
        )
        response = `${indicator} indikatörü başarıyla eklendi! Kodunuz güncellendi. 

Yeni özellikler:
• ${indicator} hesaplaması eklendi
• Gerekli değişkenler tanımlandı
• OnStart metodunda indikatör başlatıldı

Şimdi ${indicator} değerlerini strateji mantığınızda kullanabilirsiniz.`

      } else if (content.toLowerCase().includes('optimize') || content.toLowerCase().includes('iyileştir')) {
        response = `Strateji optimizasyonu için önerilerim:

**Performans İyileştirmeleri:**
1. Çoklu zaman dilimi analizi ekleyin
2. Volume filtreleme kullanın
3. Trend yönü kontrolü ekleyin

**Risk Yönetimi:**
1. Stop Loss: %2
2. Take Profit: %4  
3. Maksimum günlük kayıp limiti

**Parametre Optimizasyonu:**
• RSI period: 10-20 arasında test edin
• SMA period: 15-25 arasında deneyin

Bu değişiklikleri uygulamak ister misiniz?`

      } else {
        response = `Anlıyorum. Bu konuda size yardımcı olabilirim.

Daha spesifik yardım için şunları deneyebilirsiniz:
• "Bu stratejiyi açıkla"
• "Hataları bul ve düzelt" 
• "RSI indikatörü ekle"
• "Risk yönetimi ekle"
• "Performansı iyileştir"

Başka nasıl yardımcı olabilirim?`
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
      if (updatedCode !== strategy.code) {
        onUpdateStrategy(prev => ({ ...prev, code: updatedCode }))
        toast.success('Strateji kodu güncellendi')
      }

    } catch (error) {
      toast.error('AI asistanı ile bağlantı kurulamadı')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt)
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
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
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
                            onClick={() => sendMessage(suggestion)}
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
    </div>
  )
}